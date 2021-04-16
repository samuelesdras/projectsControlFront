import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Moment from 'moment';

const EditActivityModal = (children) => {
  const [show, setShow] = useState(children.modalState);
  const [activityToEdit, setActivityToEdit] = useState(children.activityToEdit)

  const [activityInfo, setActivityInfo] = useState('');
  const [activityName, setActivityName] = useState('');
  const [activityStartDate, setActivityStartDate] = useState('');
  const [activityEndDate, setActivityEndDate] = useState('');
  const [finished, setFinished] = useState('');
  console.log("finished",finished)
  console.log("activityInfo.finished",activityInfo.finished)
  const toggleFinished = () =>{
    setFinished(!finished)
  }

  useEffect(() => {
   Axios.get(`http://localhost:4000/project-activity/get/${activityToEdit}`)
    .then(res => {
      setActivityInfo(res.data)
    })
  },[activityToEdit]);

  const ValidationSchema = Yup.object().shape({
    activityName: Yup.string()
      .nullable()
      .trim()
      .required('Campo obrigatório'),
    activityStartDate: Yup.string()
      .nullable()
      .trim()
      .required('Campo obrigatório'),
    activityEndDate: Yup.string()
      .nullable()
      .trim()
      .required('Campo obrigatório'),
  });

    return(
      <> 
        <Formik
          initialValues={{
            activityName: activityInfo.name,
            activityStartDate: Moment(activityInfo.startdate).utc().format('YYYY-MM-DD'),
            activityEndDate: Moment(activityInfo.enddate).utc().format('YYYY-MM-DD'),
            finished: activityInfo.finished,
          }}
          enableReinitialize
          validationSchema={ValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          let dataToSave = {
            name: activityName,
            startdate: new Date(activityStartDate),
            enddate: new Date(activityEndDate),
            finished: finished,
          }
          Axios.post(`http://localhost:4000/activity/update/${activityToEdit}`, dataToSave).then(() => {
            console.log("Atividade editada.")
            toast.success('Atividade editada')
            window.location.reload(false);
          }).catch(() => {
            console.log("Não foi possível editar a atividade.")
            toast.error('Não foi possível editar a atividade.')
          });
          setSubmitting(true);
          }}>
          {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          }) => (
            <Modal show={show} onHide={show}>
              <Modal.Header closeButton>
                <Modal.Title>Editar Atividade </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-sm-12">
                    <label>Atividade</label>
                    <input 
                      type="text"
                      name="activityName"
                      className="form-control"
                      onChange={(activityName) => {
                        setActivityName(activityName.target.value);
                        setFieldValue(
                            'activityName',
                            activityName.target.value,
                        );
                      }}
                      value={values.activityName}
                    />
                    <small className="col-12 p-0 text-left text-danger">
                      {(errors.activityName
                        && touched.activityName
                        && errors.activityName)}
                    </small>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-5">
                    <label>Início</label>
                    <input 
                      type="date"
                      name="activityStartDate"
                      className="form-control"
                      onChange={(activityStartDate) => {
                        setActivityStartDate(activityStartDate.target.value);
                        setFieldValue(
                            'activityStartDate',
                            activityStartDate.target.value,
                        );
                      }}
                      value={values.activityStartDate}
                    />
                    <small className="col-12 p-0 text-left text-danger">
                      {(errors.activityStartDate
                        && touched.activityStartDate
                        && errors.activityStartDate)}
                    </small>
                  </div>
                  <div className="col-sm-5">
                    <label>Fim</label>
                    <input 
                      type="date"
                      name="activityEndDate"
                      className="form-control"
                      onChange={(activityEndDate) => {
                        setActivityEndDate(activityEndDate.target.value);
                        setFieldValue(
                            'activityEndDate',
                            activityEndDate.target.value,
                        );
                      }}
                      value={values.activityEndDate}
                    />
                    <small className="col-12 p-0 text-left text-danger">
                      {(errors.activityEndDate
                        && touched.activityEndDate
                        && errors.activityEndDate)}
                    </small>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6">
                    <input
                      type="checkbox"
                      name="finished"
                      className="mr-2"
                      onClick={toggleFinished}
                      value={values.finished}
                      // checked={finished}
                    />
                    <label>Concluido?</label>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={handleSubmit}>
                  Salvar
                </Button>
                <Button variant="warning" onClick={show}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal>
          )
          }
        </Formik>
      </>
    )
}
export default EditActivityModal