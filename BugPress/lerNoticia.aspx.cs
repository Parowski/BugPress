using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.DAO;
using BugPress.Model;

namespace BugPress
{
    public partial class lerNoticia : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string noticiaID = Request.QueryString["noticiaID"];
            BuscaNoticia(int.Parse(noticiaID));
        }
        protected void BuscaNoticia(int noticiaID)
        {
            NoticiaDAO objNoticiaDAO = new NoticiaDAO();
            Noticia objNoticia = new Noticia();

            objNoticia = objNoticiaDAO.BuscaNoticia(noticiaID);

            lblData.Text = objNoticia._Data.ToString();
            lblTipoNoticia.Text = objNoticia.TipoNoticia._Descricao;
            lblTitulo.Text = objNoticia._Titulo;
            lblTexto.Text = objNoticia._Texto;
        }
    }
}