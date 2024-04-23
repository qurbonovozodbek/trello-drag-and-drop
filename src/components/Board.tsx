import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface ListItem {
  id: string;
  content: string;
}

interface List {
  id: string;
  title: string;
  items: ListItem[];
}

const initialLists: List[] = [
  {
    id: "list1",
    title: "To Do",
    items: [
      { id: "item1", content: "Task 1" },
      { id: "item2", content: "Task 2" },
    ],
  },
  {
    id: "list2",
    title: "In Progress",
    items: [{ id: "item3", content: "Task 3" }],
  },
  {
    id: "list3",
    title: "Done",
    items: [{ id: "item4", content: "Task 4" }],
  },
];

const Board: React.FC = () => {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [newTaskContent, setNewTaskContent] = useState<string>("");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedLists = [...lists];

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same list
      const list = updatedLists.find((list) => list.id === source.droppableId);
      if (list) {
        const [removed] = list.items.splice(source.index, 1);
        list.items.splice(destination.index, 0, removed);
        setLists(updatedLists);
      }
    } else {
      // Move to a different list
      const sourceList = updatedLists.find((list) => list.id === source.droppableId);
      const destinationList = updatedLists.find((list) => list.id === destination.droppableId);
      const draggedItem = sourceList?.items[source.index];

      if (sourceList && destinationList && draggedItem) {
        sourceList.items.splice(source.index, 1);
        destinationList.items.splice(destination.index, 0, draggedItem);
        setLists(updatedLists);
      }
    }
  };

  const handleAddTask = (listId: string) => {
    if (newTaskContent.trim() === "") return;

    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        const newItem: ListItem = {
          id: `item${list.items.length + 1}`,
          content: newTaskContent,
        };
        return { ...list, items: [...list.items, newItem] };
      }
      return list;
    });

    setLists(updatedLists);
    setNewTaskContent(""); // Clear input after adding task
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {lists.map((list) => (
          <div key={list.id} className="list">
            <h2>{list.title}</h2>
            <Droppable droppableId={list.id} key={list.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {list.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="item"
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="add-task">
              <input
                type="text"
                placeholder="Add new task"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
              />
              <button onClick={() => handleAddTask(list.id)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
