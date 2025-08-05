import { useState, useEffect } from 'react';

function VoluntarioForm({ onSave, onCancel, voluntarioToEdit }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmation, setSenhaConfirmation] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [cargo, setCargo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!voluntarioToEdit;

  useEffect(() => {
    if (isEditing) {
      setNome(voluntarioToEdit.nome || '');
      setEmail(voluntarioToEdit.email || '');
      setAtivo(voluntarioToEdit.ativo);
      setCargo(voluntarioToEdit.cargo || '');
      setSenha('');
      setSenhaConfirmation('');
    }
  }, [voluntarioToEdit, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    
    const voluntarioData = { nome, email, ativo, cargo };
    
    if (senha) {
      voluntarioData.senha = senha;
      voluntarioData.senha_confirmation = senhaConfirmation;
    }
    
    await onSave(voluntarioData, voluntarioToEdit?.id);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... (campos de nome, email, cargo, etc.) ... */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="nome">Nome Completo:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="cargo">Cargo:</label>
        <input type="text" id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Desenvolvedora, Prof. de Inglês" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required={!isEditing} minLength={6} placeholder={isEditing ? "Deixe em branco para não alterar" : ""} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="senhaConfirmation">Confirmar Senha:</label>
        <input type="password" id="senhaConfirmation" value={senhaConfirmation} onChange={(e) => setSenhaConfirmation(e.target.value)} required={!isEditing || !!senha} minLength={6} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
      </div>
       <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <input type="checkbox" id="ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} style={{ marginRight: '10px' }} />
        <label htmlFor="ativo">Ativo</label>
      </div>

      {/* Botões com estado de loading */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button type="button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
        <button type="submit" disabled={isSaving} style={{ marginLeft: '10px' }}>
          {isSaving ? 'A salvar...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default VoluntarioForm;