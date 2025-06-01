export default function Home() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>File Transfer App</h1>
      
      <div style={{
        margin: '20px 0',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h2>Upload Files</h2>
        <input 
          type="file" 
          id="fileInput"
          multiple
          style={{ margin: '10px 0' }}
        />
        <button 
          id="uploadBtn"
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Upload Files
        </button>
      </div>
      
      <div id="downloadSection" style={{ display: 'none' }}>
        <h2>Download Files</h2>
        <div id="fileList"></div>
      </div>

      <script>
        document.getElementById('uploadBtn').addEventListener('click', async () => {
          const files = document.getElementById('fileInput').files;
          if (files.length === 0) return alert('Please select files first');
          
          const btn = document.getElementById('uploadBtn');
          btn.disabled = true;
          btn.textContent = 'Uploading...';
          
          try {
            const formData = new FormData();
            for (let file of files) {
              formData.append('files', file);
            }
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });
            
            const data = await response.json();
            
            if (data.links && data.links.length > 0) {
              const fileList = document.getElementById('fileList');
              fileList.innerHTML = '';
              
              data.links.forEach(link => {
                const fileItem = document.createElement('div');
                fileItem.style.margin = '10px 0';
                
                const linkElem = document.createElement('a');
                linkElem.href = `/api/download?id=${link.id}`;
                linkElem.textContent = `Download ${link.name}`;
                linkElem.style.color = '#0070f3';
                linkElem.download = link.name;
                
                fileItem.appendChild(linkElem);
                fileList.appendChild(fileItem);
              });
              
              document.getElementById('downloadSection').style.display = 'block';
              alert('Files uploaded successfully!');
            }
          } catch (error) {
            console.error(error);
            alert('Upload failed');
          } finally {
            btn.disabled = false;
            btn.textContent = 'Upload Files';
          }
        });
      </script>
    </div>
  );
}
