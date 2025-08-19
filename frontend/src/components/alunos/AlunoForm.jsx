import { useState, useEffect } from 'react';
import api from '../../services/api';

function AlunoForm({ onSave, onCancel, alunoToEdit }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomeResponsaveis, setNomeResponsaveis] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
  const [aulasSelecionadasIds, setAulasSelecionadasIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/aulas-lista').then(response => {
      setAulasDisponiveis(response.data);
    }).catch(error => console.error("Falha ao buscar aulas", error));
  }, []);

  useEffect(() => {
    if (alunoToEdit) {
      setNome(alunoToEdit.nome || '');
      setDataNascimento(alunoToEdit.data_nascimento || '');
      setNomeResponsaveis(alunoToEdit.nome_responsaveis || '');
      setTelefone(alunoToEdit.telefone || '');
      setEndereco(alunoToEdit.endereco || '');
      setAulasSelecionadasIds(alunoToEdit.aulas.map(aula => aula.id));
    } else {
      setNome('');
      setDataNascimento('');
      setNomeResponsaveis('');
      setTelefone('');
      setEndereco('');
      setAulasSelecionadasIds([]);
    }
  }, [alunoToEdit]);

  const handleAulaSelection = (aulaId) => {
    setAulasSelecionadasIds(prevSelected =>
      prevSelected.includes(aulaId)
        ? prevSelected.filter(id => id !== aulaId)
        : [...prevSelected, aulaId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const alunoData = {
      nome,
      data_nascimento: dataNascimento,
      nome_responsaveis: nomeResponsaveis,
      telefone,
      endereco,
      aulas_ids: aulasSelecionadasIds,
    };
    await onSave(alunoData, alunoToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nome">Nome Completo:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="dataNascimento">Data de Nascimento:</label>
        <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nomeResponsaveis">Nome do Responsável:</label>
        <input type="text" id="nomeResponsaveis" value={nomeResponsaveis} onChange={(e) => setNomeResponsaveis(e.target.value)} placeholder="Digite o nome do responsável" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="telefone">Telefone:</label>
        <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="endereco">Endereço:</label>
        <textarea id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Digite o endereço completo" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ marginBottom: '15px' }}>
        <label>Matricular nas Aulas:</label>
        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginTop: '5px', borderRadius: '5px' }}>
          {aulasDisponiveis.length > 0 ? aulasDisponiveis.map(aula => (
            <div key={aula.id}>
              <input
                type="checkbox"
                id={`aula-${aula.id}`}
                checked={aulasSelecionadasIds.includes(aula.id)}
                onChange={() => handleAulaSelection(aula.id)}
              />
              <label htmlFor={`aula-${aula.id}`} style={{ marginLeft: '8px' }}>
                {aula.nome}
              </label>
            </div>
          )) : <p>Carregando aulas...</p>}
        </div>
      </div>
      
      <div className="modal-footer">
        <button type="button" onClick={onCancel} disabled={isSaving} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} className="btn btn-primary">
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default AlunoForm;