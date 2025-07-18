import mapValues from 'lodash/mapValues';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
  chatSettingsValueState,
  useChatData,
  useChatInteract
} from '@chainlit/react-client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Translator } from 'components/i18n';

import { chatSettingsOpenState } from 'state/project';

import { FormInput, TFormInputValue } from './FormInput';

export default function ChatSettingsModal() {
  const { chatSettingsValue, chatSettingsInputs, chatSettingsDefaultValue } =
    useChatData();

  const { updateChatSettings } = useChatInteract();
  const [chatSettingsOpen, setChatSettingsOpen] = useRecoilState(
    chatSettingsOpenState
  );

  const { handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: chatSettingsValue
  });
  const setChatSettingsValue = useSetRecoilState(chatSettingsValueState);

  // Reset form when default values change
  useEffect(() => {
    reset(chatSettingsValue);
  }, [chatSettingsValue, reset]);

  const handleClose = (open: boolean) => {
    if (!open) {
      reset(chatSettingsValue);
      setChatSettingsOpen(false);
    }
  };

  const handleConfirm = handleSubmit((data) => {
    const processedValues = mapValues(data, (x: TFormInputValue) =>
      x !== '' ? x : null
    );
    updateChatSettings(processedValues);
    setChatSettingsValue(processedValues);
    setChatSettingsOpen(false);
  });

  const handleReset = () => {
    reset(chatSettingsDefaultValue);
  };

  // Legacy setField compatibility layer
  const handleChange = () => {};

  const setFieldValue = (field: string, value: any) => {
    setValue(field, value);
  };

  const values = watch();

  return (
    <Dialog open={chatSettingsOpen} onOpenChange={handleClose}>
      <DialogContent
        id="chat-settings"
        className="min-w-[20vw] max-h-[85vh] flex flex-col gap-6 p-6"
      >
        <DialogHeader>
          <DialogTitle>
            <Translator path="chat.settings.title" />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Customize your chat settings here
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col flex-grow overflow-y-auto gap-6 p-1">
          {chatSettingsInputs.map((input: any) => (
            <FormInput
              key={input.id}
              element={{
                ...input,
                value: values[input.id],
                onChange: handleChange,
                setField: setFieldValue
              }}
            />
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            <Translator path="common.actions.reset" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={() => handleClose(false)}>
            <Translator path="common.actions.cancel" />
          </Button>
          <Button onClick={handleConfirm} id="confirm" autoFocus>
            <Translator path="common.actions.confirm" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
