import React, { useState } from 'react';

interface NewTripProps {
    create: (name: string) => void
    cancel: () => void
};
const NewTrip: React.FC<NewTripProps> = ({ create, cancel }) => {
    const [name, setName] = useState('');
    
    return (
        <div>
            <span className="title">New trip</span>
            Name <input value={name} onChange={e => { setName(e.target.value); } } autoFocus /><br />
            <button onClick={() => create(name)}>Create</button>
            <button onClick={() => cancel()}>Cancel</button>
        </div>
    );
}

export default NewTrip;