import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const AddProject = () => {
  const history = useHistory();

  const [projectName, setProjectName] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  
  const dateValidation = (incomingDate) => {
    if(!incomingDate) return false;
    const today = moment();
    const date = moment(incomingDate, 'YYYY-MM-DD');
    if (date.isBefore(today, 'day')) {
        return true;
    }
    return false;
  };
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
            projectName,
            projectStartDate,
            projectEndDate,
        }}
        enableReinitialize
        validationSchema={ValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            let dataToSave = {
                name: projectName,
                startdate: projectStartDate,
                enddate: projectEndDate
            }
            axios.post('http://localhost:4000/project/add/', dataToSave).then(() => {
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

export default AddProject;
