import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <div className="row mt-3 mb-n3"> 
        <div className="col-sm-6">
          <h3 className="text-muted">Gerência de Projetos</h3>
        </div>
        <div className="col-sm-6 text-right">
        <nav className="my-2 my-md-0 mr-md-3 float-right">
          <Link to='/'>Início</Link>
        </nav>
        </div>
      </div>
      <hr/>
    </>
  );
}

export default Header;
