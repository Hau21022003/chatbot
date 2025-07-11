import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  EditPasswordBody,
  EditPasswordBodyType,
} from "@/schemas/settings-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { handleErrorApi } from "@/lib/error";
import { profileApiRequest } from "@/api-requests/profile";
import { toast } from "sonner";

// Component EditPasswordDialog
export const EditPasswordDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const form = useForm<EditPasswordBodyType>({
    resolver: zodResolver(EditPasswordBody),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPasswordValue = form.watch("newPassword");
  const isSubmitted = form.formState.isSubmitted;

  const passwordChecks = [
    {
      label: "At least 8 characters",
      test: (val: string) => val.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      test: (val: string) => /[A-Z]/.test(val),
    },
    {
      label: "At least one number",
      test: (val: string) => /[0-9]/.test(val),
    },
    {
      label: "At least one special character",
      test: (val: string) => /[^A-Za-z0-9]/.test(val),
    },
  ];

  const handleSave = () => {
    updatePassword(form.getValues());
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const updatePassword = async (data: EditPasswordBodyType) => {
    try {
      await profileApiRequest.updatePassword(data);
      toast.success("Success", {
        description: "Password updated successfully",
      });
      onClose();
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="mt-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input placeholder="Old password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ul className="space-y-2 mt-2">
              {passwordChecks.map((check, i) => {
                const passed = check.test(newPasswordValue || "");
                const color = passed
                  ? "text-green-600"
                  : isSubmitted
                  ? "text-red-600"
                  : "text-gray-500";
                const icon = passed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                );

                return (
                  <li
                    key={i}
                    className={`text-sm ${color} flex items-center gap-2`}
                  >
                    <span>{icon}</span>
                    {check.label}
                  </li>
                );
              })}
            </ul>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end items-center gap-4 mt-6">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button className="cursor-pointer" type="submit">
                Change password
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
