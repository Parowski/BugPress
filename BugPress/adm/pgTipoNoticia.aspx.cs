using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.DAO;
using BugPress.Model;

namespace BugPress.adm
{
    public partial class pgTipoNoticia : System.Web.UI.Page
    {
        #region Eventos
        protected void Page_Load(object sender, EventArgs e)
        {
            BuscarTipoNoticiaCadastrados();
        }
        
        protected void gvTipos_SelectedIndexChanged(object sender, EventArgs e)
        {
            int ID = Convert.ToInt32(gvTipos.SelectedDataKey.Value);
            BuscaTipoNoticia(ID);
        }
        protected void btnGravar_Click(object sender, EventArgs e)
        {
            try
            {
                TipoNoticia objTipoNoticia = new TipoNoticia();
                if (hfTipoID.Value != string.Empty)
                {
                    objTipoNoticia._TipoNoticiaID = int.Parse(hfTipoID.Value);
                }
                objTipoNoticia._Descricao = txtTipoNoticia.Text;

                if (Gravar(objTipoNoticia))
                {
                    lblMensagem.Text = "Tipo de notícia inserido com sucesso!";
                    BuscarTipoNoticiaCadastrados();
                }
                else
                {
                    lblMensagemE.Text = "Erro ao inserir o tipo de notícia!";
                }


            }
            catch (Exception)
            {
                lblMensagemE.Text = "Erro na inserção!";
            }

        }
        protected void btnNovo_Click(object sender, EventArgs e)
        {
            Response.Redirect("pgTipoNoticia.aspx");
        }
        protected void btnExcluir_Click(object sender, EventArgs e)
        {
            if (hfTipoID.Value != string.Empty)
            {
                int tiponoticiaID = int.Parse(hfTipoID.Value);
                if (Excluir(tiponoticiaID))
                {
                    LimparCampos();
                    BuscarTipoNoticiaCadastrados();
                    lblMensagem.Text = "Tipo de notícia excluído com sucesso!";
                }
                else
                {
                    lblMensagemE.Text = "Erro ao excluir o tipo de notícia!";
                }
            }
        }
        #endregion

        #region Métodos
        //Grava um novo ou altera um tipo de notícia
        protected bool Gravar(TipoNoticia objTipoNoticia)
        {
            try
            {
                TipoNoticiaDAO objTipoNoticiaDAO = new TipoNoticiaDAO();

                if (objTipoNoticia._TipoNoticiaID != 0)
                {
                    objTipoNoticiaDAO.Alterar(objTipoNoticia);
                }
                else
                {
                    objTipoNoticiaDAO.Inserir(objTipoNoticia);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //Busca todos os tipos de notícias
        protected void BuscarTipoNoticiaCadastrados()
        {
            TipoNoticiaDAO objTipoNoticia = new TipoNoticiaDAO();
            gvTipos.DataSource = objTipoNoticia.ListaTodosTiposNoticia();
            gvTipos.DataBind();
        }

        //Busca um único tipo de notícia
        protected void BuscaTipoNoticia(int ID)
        {
            TipoNoticiaDAO objTipoNoticiaDAO = new TipoNoticiaDAO();
            TipoNoticia objTipoNoticia = new TipoNoticia();

            objTipoNoticia = objTipoNoticiaDAO.BuscarTipoNoticia(ID);

            hfTipoID.Value = objTipoNoticia._TipoNoticiaID.ToString();
            txtTipoNoticia.Text = objTipoNoticia._Descricao;
        }

        //Limpa os campos do formulário
        protected void LimparCampos()
        {
            hfTipoID.Value = string.Empty;
            txtTipoNoticia.Text = string.Empty;
            lblMensagem.Text = string.Empty;
            lblMensagemE.Text = string.Empty;
        }
        //Exclui um tipo de notícia
        protected bool Excluir(int tiponoticiaID)
        {
            try
            {
                TipoNoticiaDAO objTipoNoticiaDAO = new TipoNoticiaDAO();
                objTipoNoticiaDAO.Excluir(tiponoticiaID);
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