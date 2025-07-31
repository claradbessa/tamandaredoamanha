import { useState, useEffect } from 'react';

function AlunoForm({ onSave, onCancel, alunoToEdit }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomeResponsaveis, setNomeResponsaveis] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (alunoToEdit) {
      setNome(alunoToEdit.nome || '');
      setDataNascimento(alunoToEdit.data_nascimento || '');
      setNomeResponsaveis(alunoToEdit.nome_responsaveis || '');
      setTelefone(alunoToEdit.telefone || '');
      setEndereco(alunoToEdit.endereco || '');
    }
  }, [alunoToEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const alunoData = {
      nome,
      data_nascimento: dataNascimento,
      nome_responsaveis: nomeResponsaveis,
      telefone,
      endereco,
    };

    await onSave(alunoData, alunoToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nome">Nome Completo:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="dataNascimento">Data de Nascimento:</label>
        <input
          type="date"
          id="dataNascimento"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nomeResponsaveis">Nome do Responsável:</label>
        <input
          type="text"
          id="nomeResponsaveis"
          value={nomeResponsaveis}
          onChange={(e) => setNomeResponsaveis(e.target.value)}
          placeholder="Digite o nome do responsável"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="telefone">Telefone:</label>
        <input
          type="text"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(XX) XXXXX-XXXX"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="endereco">Endereço:</label>
        <textarea
          id="endereco"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Digite o endereço completo"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" disabled={isSaving} style={{ marginLeft: '10px' }}>
          {isSaving ? 'A salvar...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default AlunoForm;