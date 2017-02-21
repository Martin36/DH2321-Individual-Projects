import java.io.*;
import java.io.FileOutputStream;

public class DataGenerator{
	public static void main(String args[]) throws IOException {  
		FileInputStream in = null;
  		FileOutputStream out = null;
  		String dataFile = "Proj1-data.csv";
  		BufferedReader br = null;
  		String line = "";
  		String csvSplitBy = ",";

		try {
		    //in = new FileInputStream("input.txt");
		    br = new BufferedReader(new FileReader(dataFile));
		    //The rightly formatted file to use in D3
		    out = new FileOutputStream("formatted-data.csv");
		    //First add the row with the different categories
		    if((line = br.readLine()) != null){
		    	String[] categoriesOld = line.split(csvSplitBy);
		    	//Now we want to save these for later (remember first element "Alias" is useless)
		    	//Here the first element is removed
		    	String[] categories = Arrays.copyOfRange(categoriesOld, 1, categoriesOld.length);
		    }
		    //The first line of the file should be "source,target,value"
		    out.write("source,target,value\n");

		    while((line = br.readLine()) != null){
		    	//The data consists of first the name, then the values of the different skills they have
		    	String[] values = line.splitBy(csvSplitBy);
		    	for(int i = 1; i < values.length; i++){
		    		//This will give an input such as "Aldor,IVIS,7"
		    		out.write(values[0] + "," + categoriesOld[i] + "," + values[i]);
		    	}
		    }


		     
		}
		finally {
		    if (in != null) {
		       in.close();
		    }
		    if (out != null) {
		       out.close();
		    }
		  }
		}

}