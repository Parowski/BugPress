using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.Model;
using BugPress.DAO;

namespace BugPress
{
    public partial class index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            BuscaTodasNoticias();
        }
        protected void BuscaTodasNoticias()
        {
            NoticiaDAO objNoticiaDAO = new NoticiaDAO();
            gvTodasNoticias.DataSource = objNoticiaDAO.ListaTodasNoticias();
            gvTodasNoticias.DataBind();
        }
        protected void gvTodasNoticias_SelectedIndexChanged(object sender, EventArgs e)
        {
            int ID = Convert.ToInt32(gvTodasNoticias.SelectedDataKey.Value);
            BuscaNoticia(ID);
        }
        protected void BuscaNoticia(int noticiaID)
        {
            NoticiaDAO objNoticiaDAO = new NoticiaDAO();
            Noticia objNoticia = new Noticia();

            objNoticia = objNoticiaDAO.BuscaNoticia(noticiaID);

            Response.Redirect("lerNoticia.aspx?noticiaID=" + objNoticia._NoticiaID);
        }
    }
}