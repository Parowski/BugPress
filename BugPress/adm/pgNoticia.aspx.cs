using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.DAO;
using BugPress.Model;
using System.Drawing;

namespace BugPress.adm
{
    public partial class pgNoticia : System.Web.UI.Page
    {
        #region Eventos
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                BuscarNoticiasCadastradas();
                PreencheTipo();
                txtData.Text = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            }

        }
        protected void btnGravar_Click(object sender, EventArgs e)
        {
            try
            {
            Noticia objNoticia = new Noticia();
            Usuario objUsuario = (Usuario)Session["usuario"];
            if (hfNoticiaID.Value != string.Empty)
            {
                objNoticia._NoticiaID = int.Parse(hfNoticiaID.Value);
            }
            objNoticia.TipoNoticia._TipoNoticiaID = int.Parse(ddlTipoNoticia.SelectedValue);
            objNoticia.Usuario._UsuarioID = objUsuario._UsuarioID;
            objNoticia._Data = DateTime.Parse(txtData.Text);
            objNoticia._Titulo = txtTitulo.Text;
            objNoticia._Texto = txtTexto.Text;

            if (Gravar(objNoticia))
            {
                lblMensagem.Text = "Notícia inserida com sucesso!";
                BuscarNoticiasCadastradas();
            }
            else
            {
                lblMensagemE.Text = "Erro ao inserir a notícia!";
            }
            }
            catch (Exception)
            {
                lblMensagemE.Text = "Erro na inserção!";
            }
        }
        protected void gvNoticias_SelectedIndexChanged(object sender, EventArgs e)
        {
            int ID = Convert.ToInt32(gvNoticias.SelectedDataKey.Value);
            BuscaNoticia(ID);
        }
        protected void btnNovo_Click(object sender, EventArgs e)
        {
            Response.Redirect("pgNoticia.aspx");
        }
        protected void btnExcluir_Click(object sender, EventArgs e)
        {
            if (hfNoticiaID.Value != string.Empty)
            {
                int noticiaID = int.Parse(hfNoticiaID.Value);
                if (Excluir(noticiaID))
                {
                    LimparCampos();
                    BuscarNoticiasCadastradas();
                    lblMensagem.Text = "Notícia excluída com sucesso!";
                }
                else
                {
                    lblMensagemE.Text = "Erro ao excluir a notícia!";
                }
            }
        }
        #endregion
        #region Métodos
        //Grava ums nova ou altera uma notícia
        protected bool Gravar(Noticia objNoticia)
        {
            try
            {
                NoticiaDAO objNoticiaDAO = new NoticiaDAO();

                if (objNoticia._NoticiaID != 0)
                {
                    objNoticiaDAO.Alterar(objNoticia);
                }
                else
                {
                    objNoticiaDAO.Inserir(objNoticia);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        //Preenche o dropdownlist com os tipos de notícias
        protected void PreencheTipo()
        {
            TipoNoticiaDAO objTipoDAO = new TipoNoticiaDAO();

            ddlTipoNoticia.DataSource = objTipoDAO.ListaTodosTiposNoticia();
            ddlTipoNoticia.DataTextField = "_Descricao";
            ddlTipoNoticia.DataValueField = "_TipoNoticiaID";
            ddlTipoNoticia.DataBind();
        }
        //Busca todas as notícias
        protected void BuscarNoticiasCadastradas()
        {
            NoticiaDAO objNoticiaDAO = new NoticiaDAO();

            gvNoticias.DataSource = objNoticiaDAO.ListaTodasNoticias();
            gvNoticias.DataBind();
        }
        //Busca uma única notícia
        protected void BuscaNoticia(int ID)
        {
            NoticiaDAO objNoticiaDAO = new NoticiaDAO();
            Noticia objNoticia = new Noticia();

            objNoticia = objNoticiaDAO.BuscaNoticia(ID);

            hfNoticiaID.Value = objNoticia._NoticiaID.ToString();
            txtTitulo.Text = objNoticia._Titulo;
            txtData.Text = objNoticia._Data.ToString();
            ddlTipoNoticia.SelectedValue = objNoticia.TipoNoticia._TipoNoticiaID.ToString();
            txtTexto.Text = objNoticia._Texto;
        }
        //Limpa os campos do formulário
        protected void LimparCampos()
        {
            hfNoticiaID.Value = string.Empty;
            txtTitulo.Text = string.Empty;
            txtTexto.Text = string.Empty;
            ddlTipoNoticia.SelectedValue = "0";
            lblMensagem.Text = string.Empty;
            lblMensagemE.Text = string.Empty;
        }
        //Exclui uma notícia
        protected bool Excluir(int noticiaID)
        {
            try
            {
                NoticiaDAO objNoticiaDAO = new NoticiaDAO();
                objNoticiaDAO.Excluir(noticiaID);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
        #endregion
    }
}