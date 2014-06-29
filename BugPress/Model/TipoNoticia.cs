using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BugPress.Model
{
    public class TipoNoticia
    {
        public int _TipoNoticiaID { get; set; }
        public string _Descricao { get; set; }
        public IList<Noticia> ListaNoticias { get; set; }

        public TipoNoticia()
        {

        }
    }
}