import React, {useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Moment from 'moment';
import { Button, Table } from 'react-bootstrap';

const ViewProject = (props) => {

  const id = props.match.params.id;
  const [projectInfo, setProjectInfo] = useState('');
  const [activities, setActivities] = useState([]);
  const history = useHistory();

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
    </tr>
  ));

  return (
      <>
        <div className="row">
          <div className="col-sm-12">
            <label>Nome do Projeto</label>
            <input 
              type="text"
              className="form-control"
              name="projectName"
              value={projectInfo.name}
              disabled
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-sm-4">
            <label>Início do projeto</label>
            <input 
              type="text"
              className="form-control"
              name="projectStartDate"
              value={
                Moment(projectInfo.startdate).utc().format('DD/MM/YYYY')
              }
              disabled
            />
            
          </div>
          <div className="col-sm-4">
            <label>Fim do projeto</label>
            <input 
              type="text"
              className="form-control"
              name="projectEndDate"
              value={
                Moment(projectInfo.enddate).utc().format('DD/MM/YYYY')
              }
              disabled
            />
          </div>
        </div>
        <div className="mt-4">
          <Table striped bordered hover responsive>
            <thead>
              {activities != '' &&
              <tr>
                <th>Id</th>
                <th>Atividade</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Finalizada?</th>
              </tr>
              }
              {activities != "" ? (activityList) : <label>Não existem atividades cadastradas para este projeto</label>}
            </thead>
          </Table>
        </div>
        <div className="row mt-4">
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
  );
}

export default ViewProject;
