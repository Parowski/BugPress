using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BugPress.Model
{
    public class Usuario
    {
        public int _UsuarioID { get; set; }
        public string _Nome { get; set; }
        public string _Email { get; set; }
        public string _Telefone { get; set; }
        public string _Sexo { get; set; }
        public string _Login { get; set; }
        public string _Senha { get; set; }
        public IList<Noticia> ListaNoticias { get; set; }

        public Usuario()
        {

        }
    }
}