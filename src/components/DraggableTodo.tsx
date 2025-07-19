import React from 'react';
import {Draggable} from '@hello-pangea/dnd';
import {Card, CardContent, Typography} from '@mui/material';
import dayjs from 'dayjs';

interface Todo {
    recordId: BigInt;
    recordText: string;
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
    todo: {backgroundColor: '#f0f0f0', borderLeft: '5px solid blue'},
    inprogress: {backgroundColor: '#fff8e1', borderLeft: '5px solid orange'},
    done: {backgroundColor: '#e8f5e9', borderLeft: '5px solid green'},
};

const getStatusStyle = (status: string) => statusStyles[status] || {};

const DraggableTodo: React.FC<DraggableTodoProps> = React.memo(({todo, idx, onClick, color}) => (
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
                        mb: 2,
                        opacity: snapshot.isDragging ? 0.7 : 1,
                        backgroundColor: color || style.backgroundColor || 'white',
                        borderLeft: style.borderLeft || 'none',
                    }}
                >
                    <CardContent>
                        <Typography>{todo.recordText}</Typography>
                        {todo.deadline && (
                            <Typography variant="caption" color="text.secondary">
                                Deadline: {dayjs(todo.deadline).format('YYYY-MM-DD')}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            );
        }}
    </Draggable>
));

export default DraggableTodo;