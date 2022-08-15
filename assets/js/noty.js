<% if(flash.success && flash.success.length>0){ %>
    new Noty({
    text: '<%=flash.success%>',
    type : 'info',
    layout : 'bottomRight',
    theme: 'mint',
    timeout : 1800    
}).show();
<%}else if(flash.error && flash.error.length>0){%>  
    new Noty({            
    text: '<%=flash.error%>',
    type : 'warning',
    layout : 'bottomRight',
    theme: 'mint',
    timeout : 1800,
}).show();
<%}%>