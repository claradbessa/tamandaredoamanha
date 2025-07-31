import { format, parseISO } from 'date-fns';

/**
 * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 */
export function formatDateBR(dateString) {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dateString;
  }
}

/**
 * Formata uma string de números para o padrão de telefone brasileiro (fixo ou móvel).
 */
export function formatPhoneBR(phoneString) {
  if (!phoneString) return '';
  const cleaned = ('' + phoneString).replace(/\D/g, '');
  
  // Verifica se é um telemóvel (11 dígitos)
  let match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // Verifica se é um telefone fixo (10 dígitos)
  match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneString; // Retorna o original se não corresponder a nenhum formato
}