#include <iostream>
#include <fstream>
using namespace std;

void main(int argc, char const *argv[])
{
	//Output file
	ofstream outfile;
	outfile.open("data.csv", ios::out | ios::trunc );
	//Input file
	fstream  afile;
	afile.open("file.dat", ios::out | ios::in );

	string row = afile.nextLine();
	

	return 0;
}