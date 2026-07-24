useEffect(() => {
  if (protocol) {
    setLoading(true);
    
    console.log('📊 Protocol en ProtocolModal:', protocol);
    
    // ============================================================
    // 🔧 CORRECCIÓN: Usar datos del JSON directamente
    // ============================================================
    // Construir detalles a partir de los datos del protocolo
    const data = { ...protocol } as any;
    const detallesConstruidos = {
      type: protocol.protocolo,
      data: data
    } as ProtocolDetails;
    setDetails(detallesConstruidos);
    setLoading(false);
  } else {
    setDetails(null);
  }
}, [protocol, selectedPC]);
