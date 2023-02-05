
import { saveAs } from 'file-saver';

export const download = (path, name )=>{
	saveAs(path, name) // Put your image url here.
}