using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BugPress.Model;
using System.Data.SqlClient;
using System.Data;

namespace BugPress.DAO
{
    public class UsuarioDAO
    {
        public void Inserir(Usuario objUsuario)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "INSERT INTO Usuarios (Nome,Email,Telefone,Sexo,Login,Senha) VALUES (@nome,@email,@telefone,@sexo,@login,@senha)";
            comando.Parameters.AddWithValue("@nome", objUsuario._Nome);
            comando.Parameters.AddWithValue("@email", objUsuario._Email);
            comando.Parameters.AddWithValue("@telefone", objUsuario._Telefone);
            comando.Parameters.AddWithValue("@sexo", objUsuario._Sexo);
            comando.Parameters.AddWithValue("@login", objUsuario._Login);
            comando.Parameters.AddWithValue("@senha", objUsuario._Senha);
            ConexaoBanco.CRUD(comando);
        }
        public void Alterar(Usuario objUsuario)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Update Usuarios Set nome=@nome,email=@email,telefone=@telefone,sexo=@sexo,login=@login,senha=@senha Where UsuarioID=@usuarioID";
            comando.Parameters.AddWithValue("@nome", objUsuario._Nome);
            comando.Parameters.AddWithValue("@email", objUsuario._Email);
            comando.Parameters.AddWithValue("@telefone", objUsuario._Telefone);
            comando.Parameters.AddWithValue("@sexo", objUsuario._Sexo);
            comando.Parameters.AddWithValue("@login", objUsuario._Login);
            comando.Parameters.AddWithValue("@senha", objUsuario._Senha);
            comando.Parameters.AddWithValue("@usuarioID", objUsuario._UsuarioID);
            ConexaoBanco.CRUD(comando);
        }
        public void Excluir(int usuarioID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Delete From Usuarios Where usuarioID=@usuarioID";
            comando.Parameters.AddWithValue("@usuarioID", usuarioID);
            ConexaoBanco.CRUD(comando);
        }
        public IList<Usuario> ListaTodosUsuarios()
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Select * From Usuarios";
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            IList<Usuario> lista = new List<Usuario>();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    Usuario objUsuario = new Usuario();
                    objUsuario._Email = dr["Email"].ToString();
                    objUsuario._Login = dr["Login"].ToString();
                    objUsuario._Nome = dr["Nome"].ToString();
                    objUsuario._Sexo = dr["Sexo"].ToString();
                    objUsuario._Telefone = dr["Telefone"].ToString();
                    objUsuario._UsuarioID = (int)dr["UsuarioID"];

                    lista.Add(objUsuario);
                }
            }
            else
            {
                lista = null;
            }
            return lista;
        }
        public Usuario BuscaUsuario(int usuarioID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Select * From Usuarios Where UsuarioID = @usuarioID";
            comando.Parameters.AddWithValue("@usuarioID", usuarioID);
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            Usuario objUsuario = new Usuario();
            if (dr.HasRows)
            {
                dr.Read();
                objUsuario._UsuarioID = (int)dr["UsuarioID"];
                objUsuario._Nome = dr["Nome"].ToString();
                objUsuario._Email = dr["Email"].ToString();
                objUsuario._Login = dr["Login"].ToString();
                objUsuario._Telefone = dr["Telefone"].ToString();
                objUsuario._Sexo = dr["Sexo"].ToString();
            }
            else
            {
                objUsuario = null;
            }
            return objUsuario;
        }
        public Usuario BuscaUsuario(string login, string senha)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Select * From Usuarios Where Login = @login and Senha=@senha";
            comando.Parameters.AddWithValue("@login", login);
            comando.Parameters.AddWithValue("@senha", senha);
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            Usuario objUsuario = new Usuario();
            if (dr.HasRows)
            {
                dr.Read();
                objUsuario._UsuarioID = (int)dr["UsuarioID"];
                objUsuario._Nome = dr["Nome"].ToString();
                objUsuario._Email = dr["Email"].ToString();
                objUsuario._Login = dr["Login"].ToString();
                objUsuario._Telefone = dr["Telefone"].ToString();
                objUsuario._Sexo = dr["Sexo"].ToString();
            }
            else
            {
                objUsuario = null;
            }
            return objUsuario;
        }
    }
}