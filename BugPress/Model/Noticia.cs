using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BugPress.Model
{
    public class Noticia
    {
        public int _NoticiaID { get; set; }
        public string _Titulo { get; set; }
        public DateTime _Data { get; set; }
        public string _Texto { get; set; }
        public TipoNoticia TipoNoticia { get; set; }
        public Usuario Usuario { get; set; }

        public Noticia()
        {
            TipoNoticia = new TipoNoticia();
            Usuario = new Usuario();
        }
    }
}