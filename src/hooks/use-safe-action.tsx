/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HookCallbacks,
  HookSafeActionFn,
  useAction,
  UseActionHookReturn,
} from "next-safe-action/hooks";
import { toast } from "sonner";

type ValidationErrorsLeaf = { _errors?: string[] | string };
type ValidationErrorsNode =
  | ValidationErrorsLeaf
  | { [key: string]: ValidationErrorsNode }
  | ValidationErrorsNode[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isLeaf = (value: unknown): value is ValidationErrorsLeaf =>
  isRecord(value) && Object.prototype.hasOwnProperty.call(value, "_errors");

const toMessage = (raw: string[] | string): string =>
  Array.isArray(raw) ? raw.join(", ") : String(raw);

const collectValidationMessages = (
  node: ValidationErrorsNode,
  path: readonly string[] = [],
): string[] => {
  if (Array.isArray(node)) {
    return node.flatMap((child, index) =>
      collectValidationMessages(child, [...path, String(index)]),
    );
  }
  if (isLeaf(node) && node._errors != null) {
    const label = path.join(".");
    const message = toMessage(node._errors);
    return [label ? `${label}: ${message}` : message];
  }
  if (isRecord(node)) {
    return Object.entries(node).flatMap(([key, value]) =>
      collectValidationMessages(value as ValidationErrorsNode, [...path, key]),
    );
  }
  return [];
};

const formatValidationErrors = (root: unknown): string | null => {
  if (!root) return null;
  const messages = collectValidationMessages(root as ValidationErrorsNode);
  return messages.length > 0 ? messages.join("\n") : null;
};

export const useSafeAction = <ServerError, CVE, Data>(
  safeActionFn: HookSafeActionFn<ServerError, any, CVE, Data>,
  toastCopy: {
    showToast?: boolean;
    loadingText?: (input: unknown) => string;
    successText?: (data?: Data) => string;
    errorText?: (error: {
      id: number;
      message: string;
      userMessage: string;
    }) => string;
  } = {
    loadingText: () => "Loading",
    successText: () => "Success",
    errorText: (error) => error.message,
  },
  utils: HookCallbacks<ServerError, any, CVE, Data> = {},
): UseActionHookReturn<ServerError, any, CVE, Data> => {
  type OnExecuteType = NonNullable<typeof utils.onExecute>;
  type OnSuccessType = NonNullable<typeof utils.onSuccess>;
  type OnErrorType = NonNullable<typeof utils.onError>;
  type OnNavigationType = NonNullable<typeof utils.onNavigation>;

  const onExecute: OnExecuteType = (args) => {
    if (toastCopy.showToast === false) return;
    toast.dismiss();
    toast.loading(toastCopy.loadingText?.(args.input) ?? "Loading");
  };

  const onSuccess: OnSuccessType = (args) => {
    if (toastCopy.showToast === false) return;
    toast.dismiss();
    if (toastCopy.successText) {
      toast.success(toastCopy.successText(args.data));
    }
  };

  const onNavigation: OnNavigationType = () => {
    if (toastCopy.showToast === false) return;
    toast.dismiss();
    if (toastCopy.successText) {
      toast.success(toastCopy.successText());
    }
  };

  const onError: OnErrorType = ({ error }) => {
    console.error(error);
    if (toastCopy.showToast === false) return;
    let errorMessage = "Please try again later";
    if (typeof error.serverError === "string") {
      errorMessage = error.serverError;
    } else if (error.validationErrors) {
      const formatted = formatValidationErrors(error.validationErrors);
      if (formatted) errorMessage = formatted;
    }
    toast.dismiss();
    toast.error(errorMessage);
  };

  const newUtils = {
    onExecute,
    onSuccess,
    onNavigation,
    onError,
    ...utils,
  };
  return useAction(safeActionFn, newUtils);
};
