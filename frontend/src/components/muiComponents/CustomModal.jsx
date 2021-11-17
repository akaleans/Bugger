import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import "./customModal.css";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  height: 75,
  bgcolor: '#ffa81c',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

export default function CustomModal( { open, handleClose, title, description } ) {
    const showHideClassName = open ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <div className="modalContainer">
                        <span className="modalTitle">
                            {title}
                        </span>
                        <div className="modalDescription">
                            {description}
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
