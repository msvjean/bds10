import './styles.css';

import { Department } from "types/department";
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Employee } from "types/employee";
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const Form = () => {
  const history = useHistory();

  const [selectDepartament, setSelectDepartament] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Employee>();

  useEffect(() => {
    requestBackend({ url: '/departments', withCredentials: true }).then((response) => {
      setSelectDepartament(response.data);
    });
  }, []);

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  const onSubmit = (formData: Employee) => {

    const data = { ...formData};
   
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/employees',
      data,
      withCredentials: true,
    };
    requestBackend(config).then(() => {
      toast.info('Empregado cadastrado com sucesso');
      history.push('/admin/employees');
    });
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
              <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Nome do empregado"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
              <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="E-mail do empregado"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block">
                  {errors.email?.message}
                </div>
              </div>
              <div className="margin-bottom-30">
              <label htmlFor="department" className="d-none">Departamento</label>
                <Controller
                  name="department"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectDepartament}
                      classNamePrefix="product-crud-select"
                      placeholder="Departamento"
                      getOptionLabel={(department) => department.name}
                      getOptionValue={(department) => String(department.id)}
                      inputId="department"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>

            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
