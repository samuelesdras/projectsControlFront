import React, { useState } from 'react';
import { Button, Modal,  } from 'react-bootstrap';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const DeleteActivityModal = (children) => {
  const [show, setShow] = useState(children.modalState);
  const [activityToDelete, setActivityToDelete] = useState(children.activityToDelete)
  console.log("activityToDelete",activityToDelete)

  const deleteActivity = () => {
    Axios.post(`http://localhost:4000/activity/delete/${activityToDelete}`)
    .then(res => {
        window.location.reload();
        setShow(false);
    }).catch(() => {
        toast.error('Não foi possível excluir o projeto.')
    })
  }

  return(
    <> 
      <Modal show={show} onHide={show}>
        <Modal.Header closeButton>
          <Modal.Title>Por favor, confirme: </Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja realmente excluir esta atividade?</Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={show}>
          Não
        </Button>
        <Button variant="warning" onClick={()=>deleteActivity()}>
          Sim, Excluir
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default DeleteActivityModal