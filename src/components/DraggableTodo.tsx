import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface Todo {
    recordId: BigInt;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'done';
    deadline?: Date | string | null;
}

interface DraggableTodoProps {
    todo: Todo;
    idx: number;
    color?: string;
    onClick?: () => void;
}

const statusStyles: Record<string, React.CSSProperties> = {
    todo: { backgroundColor: '#e3f2fd', borderLeft: '4px solid #1976d2' },
    inprogress: { backgroundColor: '#fffde7', borderLeft: '4px solid #ffa000' },
    done: { backgroundColor: '#e8f5e9', borderLeft: '4px solid #388e3c' },
};

const getStatusStyle = (status: string) => statusStyles[status] || {};

const DraggableTodo: React.FC<DraggableTodoProps> = React.memo(({ todo, idx, onClick, color }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const isLongDescription = todo.description && todo.description.length > 20;
    const displayedDescription = isLongDescription && !showFullDescription
        ? todo.description.slice(0, 20) + '...'
        : todo.description;

    return (
        <Draggable draggableId={todo.recordId.toString()} index={idx} key={todo.recordId.toString()}>
            {(provided, snapshot) => {
                const style = getStatusStyle(todo.status);
                return (
                    <Card
                        onClick={onClick}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                            mb: 1,
                            opacity: snapshot.isDragging ? 0.7 : 1,
                            backgroundColor: color || style.backgroundColor || 'white',
                            borderLeft: style.borderLeft || 'none',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                            boxShadow: snapshot.isDragging ? 3 : 0,
                            minHeight: 40,
                            borderRadius: 1,
                            p: 1,
                        }}
                    >
                        <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                            <Box mb={0.5}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: '#616161', fontWeight: 500, fontSize: '0.8rem', mb: 0.2 }}
                                >
                                    Title:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        wordBreak: 'break-word',
                                        mb: 0.5,
                                    }}
                                >
                                    {todo.title}
                                </Typography>
                            </Box>
                            <Box mb={0.5} display="flex" alignItems="center">
                                <Box flex={1}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: '#616161', fontWeight: 500, fontSize: '0.8rem', mb: 0.2 }}
                                    >
                                        Description:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#424242',
                                            fontSize: '0.85rem',
                                            wordBreak: 'break-word',
                                            mb: 0.5,
                                        }}
                                    >
                                        {displayedDescription}
                                    </Typography>
                                </Box>
                                {isLongDescription && (
                                    <Tooltip title={showFullDescription ? 'Show less' : 'Show more'}>
                                        <IconButton
                                            size="small"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setShowFullDescription(prev => !prev);
                                            }}
                                            aria-label={showFullDescription ? 'Show less' : 'Show more'}
                                        >
                                            {showFullDescription ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                            {todo.deadline && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    Deadline: {dayjs(todo.deadline).format('YYYY-MM-DD')}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                );
            }}
        </Draggable>
    );
});

export default DraggableTodo;
