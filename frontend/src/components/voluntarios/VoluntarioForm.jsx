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
      <div className="form-group">
        <label htmlFor="nome">Nome Completo:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="cargo">Cargo:</label>
        <input type="text" id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Desenvolvedora, Prof. de Inglês" />
      </div>
      <div className="form-group">
        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required={!isEditing} minLength={6} placeholder={isEditing ? "Deixe em branco para não alterar" : ""} />
      </div>
      <div className="form-group">
        <label htmlFor="senhaConfirmation">Confirmar Senha:</label>
        <input type="password" id="senhaConfirmation" value={senhaConfirmation} onChange={(e) => setSenhaConfirmation(e.target.value)} required={!isEditing || !!senha} minLength={6} />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input type="checkbox" id="ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} style={{ width: 'auto', marginRight: '10px' }} />
        <label htmlFor="ativo" style={{ fontWeight: 'normal' }}>Ativo</label>
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

export default VoluntarioForm;