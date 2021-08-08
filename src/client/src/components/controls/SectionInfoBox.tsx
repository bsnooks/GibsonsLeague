import React from 'react';

interface SectionInfoBoxProps {
    title: string;
    info: any;
}

const SectionInfoBox: React.FC<SectionInfoBoxProps> = ({ ...props }) => {

    return (
        <div className="section-info-box">
            <div className="title-container">
                <div className="title">{props.title}</div>
            </div>
            <div className="info-container">
                <div className="info">{props.info}</div>
            </div>
        </div>
    );
}

export default SectionInfoBox;
