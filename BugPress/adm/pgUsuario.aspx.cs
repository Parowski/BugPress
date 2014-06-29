using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using BugPress.Model;
using BugPress.DAO;
using System.Drawing;

namespace BugPress.adm
{
    public partial class pgUsuario : System.Web.UI.Page
    {
        #region Eventos
        protected void Page_Load(object sender, EventArgs e)
        {
            BuscarUsuariosCadastrados();
        }
        protected void btnGravar_Click(object sender, EventArgs e)
        {
            try
            {
                Usuario objUsuario = new Usuario();
                if (hfUsuarioID.Value != string.Empty)
                {
                    objUsuario._UsuarioID = int.Parse(hfUsuarioID.Value);
                }
                objUsuario._Nome = txtNome.Text;
                objUsuario._Email = txtEmail.Text;
                objUsuario._Sexo = ddlSexo.SelectedValue;
                objUsuario._Telefone = txtTelefone.Text;
                objUsuario._Login = txtLogin.Text;
                objUsuario._Senha = txtSenha.Text;

                if (Gravar(objUsuario))
                {
                    lblMensagem.Text = "Usuário inserido com sucesso!";
                    BuscarUsuariosCadastrados();
                }
                else
                {
                    lblMensagemE.Text = "Erro ao inserir o usuário!";
                }


            }
            catch (Exception)
            {
                lblMensagemE.Text = "Erro na inserção!";
            }

        }
        protected void gvUsuarios_SelectedIndexChanged(object sender, EventArgs e)
        {
            int ID = Convert.ToInt32(gvUsuarios.SelectedDataKey.Value);
            BuscaUsuario(ID);
        }

        protected void btnNovo_Click(object sender, EventArgs e)
        {
            Response.Redirect("pgUsuario.aspx");
        }

        protected void btnExcluir_Click(object sender, EventArgs e)
        {
            if (hfUsuarioID.Value != string.Empty)
            {
                int usuarioID = int.Parse(hfUsuarioID.Value);
                if (Excluir(usuarioID))
                {
                    LimparCampos();
                    BuscarUsuariosCadastrados();
                    lblMensagem.Text = "Usuário excluído com sucesso!";
                }
                else
                {
                    lblMensagemE.Text = "Erro ao excluir o usuário!";
                }
            }
        }
        #endregion

        #region Métodos
        //Grava um novo ou altera um usuário
        protected bool Gravar(Usuario objUsuario)
        {
            try
            {
                UsuarioDAO objUsuarioDAO = new UsuarioDAO();

                if (objUsuario._UsuarioID != 0)
                {
                    objUsuarioDAO.Alterar(objUsuario);
                }
                else
                {
                    objUsuarioDAO.Inserir(objUsuario);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        //Busca todos os usuários
        protected void BuscarUsuariosCadastrados()
        {
            UsuarioDAO objUsuarioDAO = new UsuarioDAO();
            gvUsuarios.DataSource = objUsuarioDAO.ListaTodosUsuarios();
            gvUsuarios.DataBind();
        }

        //Busca um único usuário
        protected void BuscaUsuario(int ID)
        {
            UsuarioDAO objUsuarioDAO = new UsuarioDAO();
            Usuario objUsuario = new Usuario();

            objUsuario = objUsuarioDAO.BuscaUsuario(ID);

            hfUsuarioID.Value = objUsuario._UsuarioID.ToString();
            txtNome.Text = objUsuario._Nome;
            txtEmail.Text = objUsuario._Email;
            txtLogin.Text = objUsuario._Login;
            txtTelefone.Text = objUsuario._Telefone;
            ddlSexo.SelectedValue = objUsuario._Sexo;
        }

        //Limpa os campos do formulário
        protected void LimparCampos()
        {
            hfUsuarioID.Value = string.Empty;
            txtNome.Text = string.Empty;
            txtEmail.Text = string.Empty;
            txtLogin.Text = string.Empty;
            txtTelefone.Text = string.Empty;
            txtSenha.Text = string.Empty;
            txtRepeteSenha.Text = string.Empty;
            ddlSexo.SelectedValue = "0";
            lblMensagem.Text = string.Empty;
            lblMensagemE.Text = string.Empty;
        }

        //Exclui um usuário
        protected bool Excluir(int usuarioID)
        {
            try
            {
                UsuarioDAO objUsuarioDAO = new UsuarioDAO();
                objUsuarioDAO.Excluir(usuarioID);
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