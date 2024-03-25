import { Dispatch, SetStateAction, useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';

export const useDnD = <T>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>,
  updateClb: (item: T, index: number, arr: T[]) => T,
) => {
  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const reorderedItems = Array.from(items);
      const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, reorderedItem);

      const updatedItems = reorderedItems.map(updateClb);

      setItems(updatedItems);
    },
    [items],
  );

  return { onDragEnd };
};
