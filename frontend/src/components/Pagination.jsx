function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) {
    return null;
  }

  const handlePageClick = (pageUrl) => {
    if (pageUrl) {
      const pageNumber = new URL(pageUrl).searchParams.get('page');
      onPageChange(pageNumber);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button onClick={() => handlePageClick(meta.links.find(link => link.label.includes('Previous'))?.url)} disabled={!meta.prev_page_url}>
        Anterior
      </button>
      <span style={{ margin: '0 15px' }}>
        Página {meta.current_page} de {meta.last_page}
      </span>
      <button onClick={() => handlePageClick(meta.links.find(link => link.label.includes('Next'))?.url)} disabled={!meta.next_page_url}>
        Próxima
      </button>
    </div>
  );
}

export default Pagination;