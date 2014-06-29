using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BugPress.Model;
using System.Data.SqlClient;
using System.Data;

namespace BugPress.DAO
{
    public class NoticiaDAO
    {
        public void Inserir(Noticia objNoticia)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Insert into Noticias(TipoNoticiaID,UsuarioID,Titulo,Data,Texto) Values (@tipoNoticiaID,@usuarioID,@titulo,@data,@texto)";
            comando.Parameters.AddWithValue("@tipoNoticiaID", objNoticia.TipoNoticia._TipoNoticiaID);
            comando.Parameters.AddWithValue("@usuarioID", objNoticia.Usuario._UsuarioID);
            comando.Parameters.AddWithValue("@titulo", objNoticia._Titulo);
            comando.Parameters.AddWithValue("@data", objNoticia._Data);
            comando.Parameters.AddWithValue("@texto", objNoticia._Texto);
            ConexaoBanco.CRUD(comando);
        }
        public void Alterar(Noticia objNoticia)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Update Noticias Set tiponoticiaid=@tipoNoticiaID,usuarioid=@usuarioID,titulo=@titulo,data=@data,texto=@texto Where noticiaid=@noticiaID";
            comando.Parameters.AddWithValue("@tipoNoticiaID", objNoticia.TipoNoticia._TipoNoticiaID);
            comando.Parameters.AddWithValue("@usuarioID", objNoticia.Usuario._UsuarioID);
            comando.Parameters.AddWithValue("@titulo", objNoticia._Titulo);
            comando.Parameters.AddWithValue("@data", objNoticia._Data);
            comando.Parameters.AddWithValue("@texto", objNoticia._Texto);
            comando.Parameters.AddWithValue("@noticiaID", objNoticia._NoticiaID);
            ConexaoBanco.CRUD(comando);
        }
        public void Excluir(int noticiaID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Delete From Noticias Where noticiaID=@noticiaID";
            comando.Parameters.AddWithValue("@noticiaID", noticiaID);
            ConexaoBanco.CRUD(comando);
        }
        public IList<Noticia> ListaTodasNoticias()
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Select * From Noticias ORDER By data DESC";
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            IList<Noticia> lista = new List<Noticia>();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    Noticia objNoticia = new Noticia();
                    objNoticia._NoticiaID = (int)dr["NoticiaID"];
                    objNoticia._Data = (DateTime)dr["Data"];
                    objNoticia._Titulo = dr["Titulo"].ToString();
                    objNoticia._Texto = dr["Texto"].ToString();
                    lista.Add(objNoticia);
                }
            }
            else
            {
                lista = null;
            }
            return lista;
        }
        public Noticia BuscaNoticia(int noticiaID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Select * From Noticias Where NoticiaID = @noticiaID";
            comando.Parameters.AddWithValue("@noticiaID", noticiaID);
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            Noticia objNoticia = new Noticia();
            if (dr.HasRows)
            {
                dr.Read();
                objNoticia._NoticiaID = (int)dr["NoticiaID"];
                objNoticia._Data = (DateTime)dr["Data"];
                objNoticia._Titulo = dr["Titulo"].ToString();
                objNoticia._Texto = dr["Texto"].ToString();
            }
            else
            {
                objNoticia = null;
            }
            return objNoticia;
        }
    }
}