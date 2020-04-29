import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  function sendFiles(): Promise<any> {
    return Promise.all(
      uploadedFiles.map(async item => {
        const data = new FormData();
        data.append('file', item.file);

        try {
          await api.post('/transactions/import', data);
        } catch (err) {
          console.error(err.response.error);
        }

        return item;
      }),
    );
  }

  async function handleUpload(): Promise<void> {
    await sendFiles();
    history.push('/');
  }

  function submitFile(files: File[]): void {
    const arrFiles: FileProps[] = [];

    files.map(item => {
      const file: FileProps = {
        name: item.name,
        file: item,
        readableSize: filesize(item.size),
      };

      arrFiles.push(file);
      return item;
    });

    setUploadedFiles([...uploadedFiles, ...arrFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
