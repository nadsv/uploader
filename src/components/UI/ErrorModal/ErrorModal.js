import React from 'react';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';

const errorModal = (props) => (
    <Modal show={props.show} modalClosed={props.cancelHandler}>
      <p>{props.message}</p>
      <Button
                btnType="Danger"
                type="button"
                clicked={props.cancelHandler}>ОК</Button>
    </Modal>
);

export default errorModal;
