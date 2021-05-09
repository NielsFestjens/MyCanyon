import React, { useState } from 'react';

interface NewCanyonProps {
    create: (name: string) => void
    cancel: () => void
};
const NewCanyon: React.FC<NewCanyonProps> = ({ create, cancel }) => {
    const [name, setName] = useState('');
    
    return (
        <div>
            <span className="title">Add canyon to trip</span>
            Name <input value={name} onChange={e => { setName(e.target.value); } } autoFocus /><br />
            <button onClick={() => create(name)}>Create</button>
            <button onClick={() => cancel()}>Cancel</button>
        </div>
    );
}

export default NewCanyon;