import React from 'react';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';

const delModal = (props) => (
    <Modal show={props.show} modalClosed={props.cancelHandler}>
      <p>Удалить запись?</p>
      <Button
                btnType="Danger"
                clicked={props.confirmHandler}>Подтвердить</Button>
            <Button
                btnType="Success"
                clicked={props.cancelHandler}>Отменить</Button>
    </Modal>
);

export default delModal;
