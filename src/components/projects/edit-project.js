import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Axios from 'axios';
import Moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import AddActivityModal from '../modals/add-activity-modal';
import EditActivityModal from '../modals/edit-activity-modal';
import DeleteActivityModal from '../modals/delete-activity-modal';

const EditProject = (props) => {

  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showDeleteActivityModal, setShowDeleteActivityModal] = useState(false);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const toggleAddActivityModal = () => setShowAddActivityModal(!showAddActivityModal);
  const toggleDeleteActivityModal = () => setShowDeleteActivityModal(!showDeleteActivityModal);
  const toggleEditActivityModal = () => setShowEditActivityModal(!showEditActivityModal);

  const id = props.match.params.id;
  const history = useHistory();
  
  const [projectInfo, setProjectInfo] = useState('');
  const [activities, setActivities] = useState([]);
  const [activityToDelete, setActivityToDelete] = useState('');
  const [activityToEdit, setActivityToEdit] = useState('');

  const [projectName, setProjectName] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  
  const dateValidation = (incomingDate) => {
    if(!incomingDate) return false;
    const today = Moment();
    const date = Moment(incomingDate, 'YYYY-MM-DD');
    if (date.isBefore(today, 'day')) {
        return true;
    }
    return false;
  };

  const chooseActivityToDelete = (id) => {
    toggleDeleteActivityModal();
    setActivityToDelete(`${id}`)
  }

  const chooseActivityToEdit = (id) => {
    toggleEditActivityModal();
    setActivityToEdit(`${id}`)
  }

  useEffect(() => {
    Axios.get(`http://localhost:4000/project/view/${id}`)
    .then(res => {
      setProjectInfo(res.data)
    })
  },[id]);

  useEffect(() => {
    Axios.get(`http://localhost:4000/activity/get/${id}`)
    .then(res => {
      setActivities(res.data)
    })
  },[id]);

  const activityList = activities.map((activity) => (
    <tr key={activity.id}>
        <td>{activity.id}</td>
        <td className="listprojects__table--col--projectname">{activity.name}</td>
        <td>{Moment(activity.startdate).utc().format('DD/MM/yyyy')}</td>
        <td>{Moment(activity.enddate).utc().format('DD/MM/yyyy')}</td>
        <td className="text-center">{activity.finished === false ? "Não" : "Sim"}</td>
        <td>
          <Link className="mr-2" onClick={()=>history.push(`/view-activity/${activity.id}`)}>
            <FaEye alt="visualizar" title="vizualizar"/>
          </Link>
          <Link className="mr-2" onClick={()=>chooseActivityToEdit(activity.id)}>
            <FaPencilAlt alt="Editar" title="Editar"/>
          </Link>
          <Link onClick={()=>chooseActivityToDelete(activity.id)}>
            <FaTrash alt="Excluir" title="Excluir" />
          </Link>
        </td>
    </tr>
  ));

  const ValidationSchema = Yup.object().shape({
    projectName: Yup.string()
      .nullable()
      .trim()
      .required('Campo obrigatório'),
    projectStartDate: Yup.string()
      .nullable()
      .trim()
      // .test('associatedBirthdate', 'O início de um projeto não pode se anterior data atual', (value) => dateValidation(value))
      .required('Campo obrigatório'),
    projectEndDate: Yup.string()
      .nullable()
      .trim()
      // .test('associatedBirthdate', 'O fim de um projeto não pode se anterior data atual', (value) => dateValidation(value))
      .required('Campo obrigatório'),
  });

  return (
    <>
      <Formik
        initialValues={{
            projectName: projectInfo.name,
            projectStartDate:Moment(projectInfo.startdate).utc().format('YYYY-MM-DD'),
            projectEndDate: Moment(projectInfo.enddate).utc().format('YYYY-MM-DD'),
        }}
        enableReinitialize
        validationSchema={ValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          let dataToSave = {
              name: projectName,
              startdate: new Date(projectStartDate),
              enddate: new Date(projectEndDate),
          }
          Axios.post(`http://localhost:4000/project/update/${id}`, dataToSave).then(() => {
            console.log("Projeto cadastrado.")
            toast.success('Projeto cadastrado')
          }).catch(() => {
            console.log("Não foi possível cadastrar o projeto.")
            toast.error('Não foi possível cadastrar o projeto.')
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
                  <>
                    {showAddActivityModal && <AddActivityModal modalState={()=>toggleAddActivityModal} fatherProject={id}/>}
                    {showDeleteActivityModal && <DeleteActivityModal modalState={()=>toggleDeleteActivityModal} activityToDelete={activityToDelete}/>}
                    {showEditActivityModal && <EditActivityModal modalState={()=>toggleEditActivityModal} activityToEdit={activityToEdit}/>}
                    <div className="row">
                      <div className="col-sm-12">
                        <label>Nome do Projeto</label>
                        <input 
                          type="text"
                          className="form-control"
                          name="projectName"
                          onChange={(projectName) => {
                            setProjectName(projectName.target.value);
                            setFieldValue(
                                'projectName',
                                projectName.target.value,
                            );
                          }}
                          value={values.projectName}
                        />
                      <small className="col-12 p-0 text-left text-danger">
                        {(errors.projectName
                            && touched.projectName
                            && errors.projectName)}
                      </small>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-sm-4">
                        <label>Início do projeto</label>
                        <input 
                          type="date"
                          className="form-control"
                          name="projectStartDate"
                          onChange={(projectStartDate) => {
                            setProjectStartDate(projectStartDate.target.value);
                            setFieldValue(
                                'projectStartDate',
                                projectStartDate.target.value,
                            );
                          }}
                          // Moment(values.projectStartDate).utc().format('DD/MM/yyyy')
                          value={values.projectStartDate}
                        />
                        <small className="col-12 p-0 text-left text-danger">
                          {(errors.projectStartDate
                              && touched.projectStartDate
                              && errors.projectStartDate)}
                        </small> 
                      </div>
                      <div className="col-sm-4">
                        <label>Fim do projeto</label>
                        <input 
                          type="date"
                          className="form-control"
                          name="projectEndDate"
                          onChange={(projectEndDate) => {
                            setProjectEndDate(projectEndDate.target.value);
                            setFieldValue(
                                'projectEndDate',
                                projectEndDate.target.value,
                            );
                          }}
                          value={values.projectEndDate}
                        />
                          <small className="col-12 p-0 text-left text-danger">
                          {(errors.projectEndDate
                            && touched.projectEndDate
                            && errors.projectEndDate)}
                        </small> 
                      </div>
                    </div>
                    <div className="row mt-3 mb-3">
                      <div className="col-sm-4">
                        <Button variant="primary" onClick={()=>toggleAddActivityModal()} >
                          Adicionar atividade
                        </Button>
                      </div>
                    </div>

                    <Table striped bordered hover responsive>
                      <thead>
                        {activities !== '' &&
                        <tr>
                          <th>Id</th>
                          <th>Atividade</th>
                          <th>Início</th>
                          <th>Fim</th>
                          <th>Finalizada?</th>
                          <th>Ações</th>
                        </tr>
                        }
                        {activities !== "" ? (activityList) : <label>Não existem atividades cadastradas para este projeto</label>}
                      </thead>
                    </Table>
                    <div className="row mt-4">
                      <div className="col-sm-2">
                        <Button 
                          variant="success"
                          onClick={handleSubmit}
                        >
                          Salvar
                        </Button>
                      </div>
                      <div className="col-sm-2">
                        <Button 
                          variant="warning" 
                          onClick={()=>history.push(`/`)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </>
                  )
            }
      </Formik>
    </>
  );
}

export default EditProject;