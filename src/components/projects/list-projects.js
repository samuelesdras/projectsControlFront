import React, {useState, useEffect} from 'react';
import { Table, Button} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import Axios from 'axios';
import Moment from 'moment';

import Style from '../style/index.css';
import DeleteProjectModal from '../modals/delete-project-modal';
import NotFound from '../not-found';

const ListProjects = () => {

  const toggleModal = () => setShowModal(!showModal);
  const [showModal, setShowModal] = useState(false);
  
  const history = useHistory();
  const convertedActualDate = Moment( new Date()).utc().format('DD/MM/YYYY');

  const [projects, setProjects] = useState([]);

  const [projectToDelete, setProjectToDelete] = useState('');

  const [allActivities, setAllActivities] = useState([]);

  const activiteCompletedPorcentage = (id) => {  
    let counterActivities = 0;
    for (let i = 1; i < allActivities.length; i++) {
      if (allActivities[i].project_id === id) counterActivities++;
    }
    
    let counterDoneActivities = 0;
    for (let i = 1; i < allActivities.length; i++) {
      if (allActivities[i].project_id === id & allActivities[i].finished === true) counterDoneActivities++;
    }
    
    let doneActivitiesPercentage = (100*counterDoneActivities)/counterActivities;
    
    return doneActivitiesPercentage
  }

  const chooseUserToDelete = (id) => {
    toggleModal();
    setProjectToDelete(`${id}`)
  }

  useEffect(() => {
    Axios.get(`http://localhost:4000/project/get`)
    .then(res => {
      setProjects(res.data);
    })
  },[])

  useEffect(() => {
    Axios.get(`http://localhost:4000/activity/get-all/`)
    .then(res => {
      setAllActivities(res.data)
    })
  },[]);

  const projectsList = projects.map((project) => (
    <tr key={project.id} setProjectId={()=>project.id}>
      <td>{project.id}</td>
      <td className="listprojects__table--col--projectname">{project.name ? project.name : "Não informado"}</td>
      <td>{project.startdate ? Moment(project.startdate).utc().format('DD/MM/YYYY') : "Não informado"}</td>
      <td>{project.enddate ? Moment(project.enddate).utc().format('DD/MM/YYYY') : "Não informado"}</td>
      <td>{(activiteCompletedPorcentage(project.id)!== "" || activiteCompletedPorcentage(project.id) != null ? activiteCompletedPorcentage(project.id): "0")} %</td>
      <td>{(Moment(project.enddate).utc().format('DD/MM/YYYY') < convertedActualDate) ? "Sim" : "Não"}</td>
      <td>
        <Link className="mr-2" onClick={()=>history.push(`/view-project/${project.id}`)}>
          <FaEye alt="visualizar" title="vizualizar"/>
        </Link>
        <Link className="mr-2" onClick={()=>history.push(`/edit-project/${project.id}`)}>
          <FaPencilAlt alt="Editar" title="Editar"/>
        </Link>
        <Link onClick={()=>chooseUserToDelete(project.id)}>
          <FaTrash alt="Excluir" title="Excluir" />
        </Link>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="text-right mb-3">
        <Button variant="primary" onClick={()=>history.push(`/add-project`)}>
          Adicionar Projeto
        </Button>
        {showModal && <DeleteProjectModal modalState={()=>toggleModal} projectToDelete={projectToDelete}/>}
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Projeto</th>
            <th>Início</th>
            <th>Fim</th>
            <th>%Completo</th>
            <th>Atrasado?</th>
            <th>Ações</th>
          </tr>
          {projects !== "" ? (projectsList) : <NotFound/>}
        </thead>
      </Table>
    </>
  );
}

export default ListProjects;
