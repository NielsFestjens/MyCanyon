import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

interface LabelProps {
    label: string;
    value: any;
    updateValue: (value: any) => void
}
const EditableLabel : React.FC<LabelProps> = ({label, value, updateValue}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [sentValue, setSentValue] = useState();
    const [editValue, setEditValue] = useState(value);

    if (value !== sentValue)
    {
        setSentValue(value);
        setEditValue(value);
        setIsEditing(false);
    }

    const startEditing = () => {
        setIsEditing(true);
    }

    const finishEditing = () => {
        if (isEditing) {
            updateValue(editValue);
            setIsEditing(false);
        }
    }

    if (isEditing)
        return (
        <>
            <label>
                {label}:&nbsp;
                <input value={editValue} onChange={e => { setEditValue(e.target.value); } } onBlur={finishEditing} autoFocus />
            </label>
            <br />
        </>
    );

    return (
        <>
            <span onClick={startEditing} className="clickable">
                {label}: {editValue}
                <FontAwesomeIcon icon={faPencilAlt} size="xs" />
            </span>
            <br />
        </>
    );
}

export default EditableLabel;