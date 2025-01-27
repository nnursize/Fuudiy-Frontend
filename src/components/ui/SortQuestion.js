import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Typography, Paper } from '@mui/material';

const SortQuestion = ({ question, options = [], onChange }) => {
    const [localOptions, setLocalOptions] = useState(options);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedOptions = Array.from(localOptions);
        const [movedItem] = reorderedOptions.splice(result.source.index, 1);
        reorderedOptions.splice(result.destination.index, 0, movedItem);

        setLocalOptions(reorderedOptions);
        if (onChange) onChange(reorderedOptions);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {question}
            </Typography>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            {localOptions.map((option, index) => (
                                <Draggable key={option} draggableId={option} index={index}>
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                padding: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: 'background.paper',
                                                borderRadius: 1,
                                                boxShadow: 1,
                                            }}
                                        >
                                            {option}
                                        </Paper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default  SortQuestion;
