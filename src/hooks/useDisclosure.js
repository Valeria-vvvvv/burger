import React, { useState } from "react";

// Кастомный хук для контроля открытия/закрытия компонента
export const useDisclosure = () => {
  // Состояние открытости/закрытости компонента
  const [isOpen, setIsOpen] = useState(false);

  // Функция для открытия компонента
  const onOpen = () => setIsOpen(true);

  // Функция для закрытия компонента
  const onClose = (event) => {
    if (event) {
      event?.stopPropagation();
    }
    setIsOpen(false);
  };

  // Функция переключения состояния компонента
  const onToggle = () => setIsOpen((prevState) => !prevState);

  return { isOpen, onOpen, onClose, onToggle };
};
