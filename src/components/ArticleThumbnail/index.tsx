import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDeleted } from "../../data/DeletedContext";
import { formataData } from "../../helpers/date";
import apiClient from "../../services/api-client";
import { ArticleThumbnailProps } from "./ArticleThumbnail.types";

export const ArticleThumbnail: React.FC<ArticleThumbnailProps> = ({
  id,
  imagem,
  titulo,
  resumo,
  dataPublicacao,
  tempoLeitura = '7 min',
  autor,
}) => {
  const verArtigo = `/artigo/${id}`
  const editarArtigo = `/artigos/editar/${id}`
  const [ editavel, setEditavel ] = useState(false)
  const [ erro, setErro ] = useState('')

  const {deleted, setDeleted} = useDeleted()
  
  async function remove(id:number) {
    try {
      await apiClient.delete(`/artigos/${id}`) 
      deleted ? setDeleted(false) : setDeleted(true)
      console.log("artigo deletado")
    } catch (error:any ) {
      error.response.data.statusCode === 401 ?
        setErro('Unauthorized') :
        setErro('Erro ao deletar artigo')
    }
  }

  useEffect (()=> {
    const idLocalStorage = Number(localStorage.getItem("id"))
    setEditavel(idLocalStorage === autor.id)
  }, [autor])

  return (
    <div className="flex flex-col w-2/3 mt-5">
      <header className="flex flex-row gap-3 items-center">
          <img
            src={autor.avatar}
            className="rounded-full"
            style={{ width: '30px', height: '30px' }}
          />
        <div>{autor.nome}</div>
        <div className="text-sm text-gray-500">{formataData(dataPublicacao)}</div>
      </header>
      <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3 flex flex-col">
            <Link  to={verArtigo}>
              <div className="font-bold text-lg pt-3">
                {titulo}
              </div>
              <div className="font-light pt-2 text-base text-gray-600">
                {resumo}
              </div>
            </Link>
          </div>
          <div className="flex items-center h-[100px]">
            <Link to={verArtigo}>
              <img
                className="mt-10"
                src={imagem}
                alt={`imagem-do-artigo-${titulo}`}
              />
            </Link>
          </div> 
      </div>
      <footer className="flex flex-row pt-7 gap-3 items-center">
        <div className="text-gray-500 text-xs my-1">
          {tempoLeitura} de leitura
        </div>
        {
          editavel &&
           (
             <>
            <Link to={editarArtigo}>
              <button
                className={
                  `
                  hover:bg-blue-400 bg-blue-300 text-white
                  delay-100 duration-100
                  rounded-full py-1 px-2 text-xs
                  `
                }
                >
                Editar
              </button>
            </Link>
            <button
              className={
                `
                hover:bg-red-400 bg-red-300 text-white
                delay-100 duration-100
                rounded-full py-1 px-2 text-xs
                `
              }
              onClick={() => remove(id)}
              >
              Delete
            </button>
            </>
          )
        }
      </footer>
      <hr className="mt-5" />
    </div>
  );
}