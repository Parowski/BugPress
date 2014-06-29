using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BugPress.Model;
using System.Data.SqlClient;
using System.Data;

namespace BugPress.DAO
{
    public class TipoNoticiaDAO
    {
        public void Inserir(TipoNoticia objTipoNoticia)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "INSERT INTO TipoNoticias (Descricao) VALUES (@descricao)";
            comando.Parameters.AddWithValue("@descricao", objTipoNoticia._Descricao);
            ConexaoBanco.CRUD(comando);
        }
        public void Alterar(TipoNoticia objTipoNoticia)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Update TipoNoticias Set descricao=@descricao Where tiponoticiaid=@tipoNoticiaID";
            comando.Parameters.AddWithValue("@tipoNoticiaID", objTipoNoticia._TipoNoticiaID);
            comando.Parameters.AddWithValue("@descricao", objTipoNoticia._Descricao);
            ConexaoBanco.CRUD(comando);
        }
        public void Excluir(int tiponoticiaID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "Delete From TipoNoticias Where tiponoticiaID=@tiponoticiaID";
            comando.Parameters.AddWithValue("@tiponoticiaID", tiponoticiaID);
            ConexaoBanco.CRUD(comando);
        }
        public IList<TipoNoticia> ListaTodosTiposNoticia()
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "select * from tiponoticias";

            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            IList<TipoNoticia> lista = new List<TipoNoticia>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    TipoNoticia obj = new TipoNoticia();
                    obj._Descricao = dr["descricao"].ToString();
                    obj._TipoNoticiaID = (int)dr["tiponoticiaID"];
                    lista.Add(obj);

                }
            }
            else
            {
                lista = null;
            }
            return lista;
        }
        public TipoNoticia BuscarTipoNoticia(int tipoNoticiaID)
        {
            SqlCommand comando = new SqlCommand();
            comando.CommandType = CommandType.Text;
            comando.CommandText = "select * from tipoNoticias where tipoNoticiaid = @tipoNoticiaID";
            comando.Parameters.AddWithValue("@tipoNoticiaID", tipoNoticiaID);
            SqlDataReader dr = ConexaoBanco.Selecionar(comando);
            TipoNoticia obj = new TipoNoticia();
            if (dr.HasRows)
            {
                dr.Read();
                obj._TipoNoticiaID = (int)dr["tipoNoticiaID"];
                obj._Descricao = dr["descricao"].ToString();

            }
            else
            {
                obj = null;
            }
            return obj;
        }
    }
}