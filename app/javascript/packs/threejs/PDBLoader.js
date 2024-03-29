import * as THREE from "three";
// import * as text from './1vzk.pdb';

const pdbText = `HEADER    NUCLEIC ACID                            20-MAY-04   1VZK              
TITLE     A THIOPHENE BASED DIAMIDINE FORMS A "SUPER" AT BINDING MINOR GROOVE   
TITLE    2 AGENT                                                                
COMPND    MOL_ID: 1;                                                            
COMPND   2 MOLECULE: 5'-D(*CP*GP*CP*GP*AP*AP*TP*TP*CP*GP *CP*G)-3';             
COMPND   3 CHAIN: A, B;                                                         
COMPND   4 ENGINEERED: YES                                                      
SOURCE    MOL_ID: 1;                                                            
SOURCE   2 SYNTHETIC: YES                                                       
KEYWDS    NUCLEIC ACID, NUCLEIC ACIDS, MINOR GROOVE BINDER, DOUBLE HELIX, DNA-  
KEYWDS   2 DRUG COMPLEX, MAGNESIUM-WATER COMPLEX, DNA HYDRATION                 
EXPDTA    X-RAY DIFFRACTION                                                     
AUTHOR    S.MALLENA,M.P.H.LEE,C.BAILLY,S.NEIDLE,A.KUMAR,D.W.BOYKIN,W.D.WILSON   
REVDAT   3   22-MAY-19 1VZK    1       REMARK                                   
REVDAT   2   24-FEB-09 1VZK    1       VERSN                                    
REVDAT   1   25-OCT-04 1VZK    0                                                
JRNL        AUTH   S.MALLENA,M.P.H.LEE,C.BAILLY,S.NEIDLE,A.KUMAR,D.W.BOYKIN,    
JRNL        AUTH 2 W.D.WILSON                                                   
JRNL        TITL   THIOPHENE-BASED DIAMIDINE FORMS A "SUPER" AT BINDING MINOR   
JRNL        TITL 2 GROOVE AGENT                                                 
JRNL        REF    J.AM.CHEM.SOC.                V. 142 13659 2004              
JRNL        REFN                   ISSN 0002-7863                               
JRNL        PMID   15493923                                                     
JRNL        DOI    10.1021/JA048175M                                            
REMARK   2                                                                      
REMARK   2 RESOLUTION.    1.77 ANGSTROMS.                                       
REMARK   3                                                                      
REMARK   3 REFINEMENT.                                                          
REMARK   3   PROGRAM     : SHELXL-97                                            
REMARK   3   AUTHORS     : G.M.SHELDRICK                                        
REMARK   3                                                                      
REMARK   3  DATA USED IN REFINEMENT.                                            
REMARK   3   RESOLUTION RANGE HIGH (ANGSTROMS) : 1.77                           
REMARK   3   RESOLUTION RANGE LOW  (ANGSTROMS) : 8.00                           
REMARK   3   DATA CUTOFF            (SIGMA(F)) : 2.000                          
REMARK   3   COMPLETENESS FOR RANGE        (%) : 85.8                           
REMARK   3   CROSS-VALIDATION METHOD           : FREE R-VALUE                   
REMARK   3   FREE R VALUE TEST SET SELECTION   : RANDOM                         
REMARK   3                                                                      
REMARK   3  FIT TO DATA USED IN REFINEMENT (NO CUTOFF).                         
REMARK   3   R VALUE   (WORKING + TEST SET, NO CUTOFF) : 0.223                  
REMARK   3   R VALUE          (WORKING SET, NO CUTOFF) : 0.227                  
REMARK   3   FREE R VALUE                  (NO CUTOFF) : 0.295                  
REMARK   3   FREE R VALUE TEST SET SIZE (%, NO CUTOFF) : 10.100                 
REMARK   3   FREE R VALUE TEST SET COUNT   (NO CUTOFF) : 662                    
REMARK   3   TOTAL NUMBER OF REFLECTIONS   (NO CUTOFF) : 5894                   
REMARK   3                                                                      
REMARK   3  FIT/AGREEMENT OF MODEL FOR DATA WITH F>4SIG(F).                     
REMARK   3   R VALUE   (WORKING + TEST SET, F>4SIG(F)) : 0.215                  
REMARK   3   R VALUE          (WORKING SET, F>4SIG(F)) : 0.220                  
REMARK   3   FREE R VALUE                  (F>4SIG(F)) : 0.291                  
REMARK   3   FREE R VALUE TEST SET SIZE (%, F>4SIG(F)) : 10.100                 
REMARK   3   FREE R VALUE TEST SET COUNT   (F>4SIG(F)) : 617                    
REMARK   3   TOTAL NUMBER OF REFLECTIONS   (F>4SIG(F)) : 5495                   
REMARK   3                                                                      
REMARK   3  NUMBER OF NON-HYDROGEN ATOMS USED IN REFINEMENT.                    
REMARK   3   PROTEIN ATOMS      : 0                                             
REMARK   3   NUCLEIC ACID ATOMS : 486                                           
REMARK   3   HETEROGEN ATOMS    : 27                                            
REMARK   3   SOLVENT ATOMS      : 60                                            
REMARK   3                                                                      
REMARK   3  MODEL REFINEMENT.                                                   
REMARK   3   OCCUPANCY SUM OF NON-HYDROGEN ATOMS      : 573.00                  
REMARK   3   OCCUPANCY SUM OF HYDROGEN ATOMS          : 0.00                    
REMARK   3   NUMBER OF DISCRETELY DISORDERED RESIDUES : 0                       
REMARK   3   NUMBER OF LEAST-SQUARES PARAMETERS       : 2307                    
REMARK   3   NUMBER OF RESTRAINTS                     : 2538                    
REMARK   3                                                                      
REMARK   3  RMS DEVIATIONS FROM RESTRAINT TARGET VALUES.                        
REMARK   3   BOND LENGTHS                         (A) : 0.008                   
REMARK   3   ANGLE DISTANCES                      (A) : 0.028                   
REMARK   3   SIMILAR DISTANCES (NO TARGET VALUES) (A) : 0.000                   
REMARK   3   DISTANCES FROM RESTRAINT PLANES      (A) : 0.002                   
REMARK   3   ZERO CHIRAL VOLUMES               (A**3) : 0.000                   
REMARK   3   NON-ZERO CHIRAL VOLUMES           (A**3) : 0.006                   
REMARK   3   ANTI-BUMPING DISTANCE RESTRAINTS     (A) : 0.004                   
REMARK   3   RIGID-BOND ADP COMPONENTS         (A**2) : 0.000                   
REMARK   3   SIMILAR ADP COMPONENTS            (A**2) : 0.040                   
REMARK   3   APPROXIMATELY ISOTROPIC ADPS      (A**2) : 0.000                   
REMARK   3                                                                      
REMARK   3  BULK SOLVENT MODELING.                                              
REMARK   3   METHOD USED: MOEWS & KRETSINGER, J.MOL.BIOL.91(1973)201-228        
REMARK   3                                                                      
REMARK   3  STEREOCHEMISTRY TARGET VALUES : ENGH AND HUBER                      
REMARK   3   SPECIAL CASE: NULL                                                 
REMARK   3                                                                      
REMARK   3  OTHER REFINEMENT REMARKS: ANISOTROPIC SCALING APPLIED BY THE        
REMARK   3  METHOD OF PARKIN, MOEZZI & HOPE, J.APPL.CRYST.28(1995)53-56         
REMARK   4                                                                      
REMARK   4 1VZK COMPLIES WITH FORMAT V. 3.30, 13-JUL-11                         
REMARK 100                                                                      
REMARK 100 THIS ENTRY HAS BEEN PROCESSED BY PDBE ON 20-MAY-04.                  
REMARK 100 THE DEPOSITION ID IS D_1290015035.                                   
REMARK 200                                                                      
REMARK 200 EXPERIMENTAL DETAILS                                                 
REMARK 200  EXPERIMENT TYPE                : X-RAY DIFFRACTION                  
REMARK 200  DATE OF DATA COLLECTION        : 28-APR-03                          
REMARK 200  TEMPERATURE           (KELVIN) : 103.0                              
REMARK 200  PH                             : 7.00                               
REMARK 200  NUMBER OF CRYSTALS USED        : 1                                  
REMARK 200                                                                      
REMARK 200  SYNCHROTRON              (Y/N) : N                                  
REMARK 200  RADIATION SOURCE               : ROTATING ANODE                     
REMARK 200  BEAMLINE                       : NULL                               
REMARK 200  X-RAY GENERATOR MODEL          : RIGAKU RU200                       
REMARK 200  MONOCHROMATIC OR LAUE    (M/L) : M                                  
REMARK 200  WAVELENGTH OR RANGE        (A) : 1.54178                            
REMARK 200  MONOCHROMATOR                  : NI FILTER                          
REMARK 200  OPTICS                         : OSMIC FOCUSSING MIRRORS            
REMARK 200                                                                      
REMARK 200  DETECTOR TYPE                  : IMAGE PLATE                        
REMARK 200  DETECTOR MANUFACTURER          : RIGAKU RAXIS IV                    
REMARK 200  INTENSITY-INTEGRATION SOFTWARE : DENZO                              
REMARK 200  DATA SCALING SOFTWARE          : SCALEPACK                          
REMARK 200                                                                      
REMARK 200  NUMBER OF UNIQUE REFLECTIONS   : 6667                               
REMARK 200  RESOLUTION RANGE HIGH      (A) : 1.770                              
REMARK 200  RESOLUTION RANGE LOW       (A) : 17.000                             
REMARK 200  REJECTION CRITERIA  (SIGMA(I)) : 1.000                              
REMARK 200                                                                      
REMARK 200 OVERALL.                                                             
REMARK 200  COMPLETENESS FOR RANGE     (%) : 95.2                               
REMARK 200  DATA REDUNDANCY                : 6.580                              
REMARK 200  R MERGE                    (I) : 0.04300                            
REMARK 200  R SYM                      (I) : NULL                               
REMARK 200  <I/SIGMA(I)> FOR THE DATA SET  : 70.1800                            
REMARK 200                                                                      
REMARK 200 IN THE HIGHEST RESOLUTION SHELL.                                     
REMARK 200  HIGHEST RESOLUTION SHELL, RANGE HIGH (A) : 1.77                     
REMARK 200  HIGHEST RESOLUTION SHELL, RANGE LOW  (A) : 1.83                     
REMARK 200  COMPLETENESS FOR SHELL     (%) : 92.5                               
REMARK 200  DATA REDUNDANCY IN SHELL       : NULL                               
REMARK 200  R MERGE FOR SHELL          (I) : 0.13500                            
REMARK 200  R SYM FOR SHELL            (I) : NULL                               
REMARK 200  <I/SIGMA(I)> FOR SHELL         : 13.16                              
REMARK 200                                                                      
REMARK 200 DIFFRACTION PROTOCOL: SINGLE WAVELENGTH                              
REMARK 200 METHOD USED TO DETERMINE THE STRUCTURE: MOLECULAR REPLACEMENT        
REMARK 200 SOFTWARE USED: CNS                                                   
REMARK 200 STARTING MODEL: DNA PART OF NDB ENTRY GDL009 OR PDB ENTRY 2DBE       
REMARK 200                                                                      
REMARK 200 REMARK: NULL                                                         
REMARK 280                                                                      
REMARK 280 CRYSTAL                                                              
REMARK 280 SOLVENT CONTENT, VS   (%): 56.05                                     
REMARK 280 MATTHEWS COEFFICIENT, VM (ANGSTROMS**3/DA): 2.80                     
REMARK 280                                                                      
REMARK 280 CRYSTALLIZATION CONDITIONS: MGCL2, DNA, COMPOUND DB818, MPD,         
REMARK 280  SPERMINE, SODIUM CACODYLATE BUFFER., PH 7.00                        
REMARK 290                                                                      
REMARK 290 CRYSTALLOGRAPHIC SYMMETRY                                            
REMARK 290 SYMMETRY OPERATORS FOR SPACE GROUP: P 21 21 21                       
REMARK 290                                                                      
REMARK 290      SYMOP   SYMMETRY                                                
REMARK 290     NNNMMM   OPERATOR                                                
REMARK 290       1555   X,Y,Z                                                   
REMARK 290       2555   -X+1/2,-Y,Z+1/2                                         
REMARK 290       3555   -X,Y+1/2,-Z+1/2                                         
REMARK 290       4555   X+1/2,-Y+1/2,-Z                                         
REMARK 290                                                                      
REMARK 290     WHERE NNN -> OPERATOR NUMBER                                     
REMARK 290           MMM -> TRANSLATION VECTOR                                  
REMARK 290                                                                      
REMARK 290 CRYSTALLOGRAPHIC SYMMETRY TRANSFORMATIONS                            
REMARK 290 THE FOLLOWING TRANSFORMATIONS OPERATE ON THE ATOM/HETATM             
REMARK 290 RECORDS IN THIS ENTRY TO PRODUCE CRYSTALLOGRAPHICALLY                
REMARK 290 RELATED MOLECULES.                                                   
REMARK 290   SMTRY1   1  1.000000  0.000000  0.000000        0.00000            
REMARK 290   SMTRY2   1  0.000000  1.000000  0.000000        0.00000            
REMARK 290   SMTRY3   1  0.000000  0.000000  1.000000        0.00000            
REMARK 290   SMTRY1   2 -1.000000  0.000000  0.000000       12.83850            
REMARK 290   SMTRY2   2  0.000000 -1.000000  0.000000        0.00000            
REMARK 290   SMTRY3   2  0.000000  0.000000  1.000000       32.59250            
REMARK 290   SMTRY1   3 -1.000000  0.000000  0.000000        0.00000            
REMARK 290   SMTRY2   3  0.000000  1.000000  0.000000       19.96050            
REMARK 290   SMTRY3   3  0.000000  0.000000 -1.000000       32.59250            
REMARK 290   SMTRY1   4  1.000000  0.000000  0.000000       12.83850            
REMARK 290   SMTRY2   4  0.000000 -1.000000  0.000000       19.96050            
REMARK 290   SMTRY3   4  0.000000  0.000000 -1.000000        0.00000            
REMARK 290                                                                      
REMARK 290 REMARK: NULL                                                         
REMARK 300                                                                      
REMARK 300 BIOMOLECULE: 1                                                       
REMARK 300 SEE REMARK 350 FOR THE AUTHOR PROVIDED AND/OR PROGRAM                
REMARK 300 GENERATED ASSEMBLY INFORMATION FOR THE STRUCTURE IN                  
REMARK 300 THIS ENTRY. THE REMARK MAY ALSO PROVIDE INFORMATION ON               
REMARK 300 BURIED SURFACE AREA.                                                 
REMARK 350                                                                      
REMARK 350 COORDINATES FOR A COMPLETE MULTIMER REPRESENTING THE KNOWN           
REMARK 350 BIOLOGICALLY SIGNIFICANT OLIGOMERIZATION STATE OF THE                
REMARK 350 MOLECULE CAN BE GENERATED BY APPLYING BIOMT TRANSFORMATIONS          
REMARK 350 GIVEN BELOW.  BOTH NON-CRYSTALLOGRAPHIC AND                          
REMARK 350 CRYSTALLOGRAPHIC OPERATIONS ARE GIVEN.                               
REMARK 350                                                                      
REMARK 350 BIOMOLECULE: 1                                                       
REMARK 350 AUTHOR DETERMINED BIOLOGICAL UNIT: DIMERIC                           
REMARK 350 SOFTWARE DETERMINED QUATERNARY STRUCTURE: DIMERIC                    
REMARK 350 SOFTWARE USED: PQS                                                   
REMARK 350 APPLY THE FOLLOWING TO CHAINS: A, B                                  
REMARK 350   BIOMT1   1  1.000000  0.000000  0.000000        0.00000            
REMARK 350   BIOMT2   1  0.000000  1.000000  0.000000        0.00000            
REMARK 350   BIOMT3   1  0.000000  0.000000  1.000000        0.00000            
REMARK 500                                                                      
REMARK 500 GEOMETRY AND STEREOCHEMISTRY                                         
REMARK 500 SUBTOPIC: COVALENT BOND ANGLES                                       
REMARK 500                                                                      
REMARK 500 THE STEREOCHEMICAL PARAMETERS OF THE FOLLOWING RESIDUES              
REMARK 500 HAVE VALUES WHICH DEVIATE FROM EXPECTED VALUES BY MORE               
REMARK 500 THAN 6*RMSD (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN               
REMARK 500 IDENTIFIER; SSEQ=SEQUENCE NUMBER; I=INSERTION CODE).                 
REMARK 500                                                                      
REMARK 500 STANDARD TABLE:                                                      
REMARK 500 FORMAT: (10X,I3,1X,A3,1X,A1,I4,A1,3(1X,A4,2X),12X,F5.1)              
REMARK 500                                                                      
REMARK 500 EXPECTED VALUES PROTEIN: ENGH AND HUBER, 1999                        
REMARK 500 EXPECTED VALUES NUCLEIC ACID: CLOWNEY ET AL 1996                     
REMARK 500                                                                      
REMARK 500  M RES CSSEQI ATM1   ATM2   ATM3                                     
REMARK 500     DC A   1   O4' -  C1' -  N1  ANGL. DEV. =  -4.4 DEGREES          
REMARK 500     DA A   5   O4' -  C1' -  N9  ANGL. DEV. =  -4.8 DEGREES          
REMARK 500     DA A   6   O4' -  C1' -  N9  ANGL. DEV. =  -5.0 DEGREES          
REMARK 500     DT A   7   O4' -  C1' -  N1  ANGL. DEV. =  -4.4 DEGREES          
REMARK 500     DT A   8   O4' -  C1' -  N1  ANGL. DEV. =  -4.5 DEGREES          
REMARK 500     DC A   9   O4' -  C1' -  N1  ANGL. DEV. =  -5.9 DEGREES          
REMARK 500     DG A  10   C3' -  C2' -  C1' ANGL. DEV. =  -5.3 DEGREES          
REMARK 500     DC A  11   O4' -  C1' -  N1  ANGL. DEV. =  -7.7 DEGREES          
REMARK 500     DC B  15   O4' -  C1' -  N1  ANGL. DEV. =  -4.3 DEGREES          
REMARK 500     DA B  17   O4' -  C1' -  N9  ANGL. DEV. =  -7.5 DEGREES          
REMARK 500     DA B  18   O4' -  C1' -  N9  ANGL. DEV. =  -5.8 DEGREES          
REMARK 500     DC B  21   O4' -  C1' -  N1  ANGL. DEV. =  -4.8 DEGREES          
REMARK 500                                                                      
REMARK 500 REMARK: NULL                                                         
REMARK 525                                                                      
REMARK 525 SOLVENT                                                              
REMARK 525                                                                      
REMARK 525 THE SOLVENT MOLECULES HAVE CHAIN IDENTIFIERS THAT                    
REMARK 525 INDICATE THE POLYMER CHAIN WITH WHICH THEY ARE MOST                  
REMARK 525 CLOSELY ASSOCIATED. THE REMARK LISTS ALL THE SOLVENT                 
REMARK 525 MOLECULES WHICH ARE MORE THAN 5A AWAY FROM THE                       
REMARK 525 NEAREST POLYMER CHAIN (M = MODEL NUMBER;                             
REMARK 525 RES=RESIDUE NAME; C=CHAIN IDENTIFIER; SSEQ=SEQUENCE                  
REMARK 525 NUMBER; I=INSERTION CODE):                                           
REMARK 525                                                                      
REMARK 525  M RES CSSEQI                                                        
REMARK 525    HOH A2003        DISTANCE =  5.96 ANGSTROMS                       
REMARK 620                                                                      
REMARK 620 METAL COORDINATION                                                   
REMARK 620 (M=MODEL NUMBER; RES=RESIDUE NAME; C=CHAIN IDENTIFIER;               
REMARK 620 SSEQ=SEQUENCE NUMBER; I=INSERTION CODE):                             
REMARK 620                                                                      
REMARK 620 COORDINATION ANGLES FOR:  M RES CSSEQI METAL                         
REMARK 620                              MG A1014  MG                            
REMARK 620 N RES CSSEQI ATOM                                                    
REMARK 620 1 HOH A2016   O                                                      
REMARK 620 2 HOH B2019   O    89.6                                              
REMARK 620 3 HOH A2011   O   179.8  90.2                                        
REMARK 620 4 HOH A2015   O    89.6  89.8  90.5                                  
REMARK 620 5 HOH A2020   O    90.4 179.6  89.8  89.8                            
REMARK 620 6 HOH A2009   O    90.2  90.4  89.7 179.8  90.1                      
REMARK 620 N                    1     2     3     4     5                       
REMARK 800                                                                      
REMARK 800 SITE                                                                 
REMARK 800 SITE_IDENTIFIER: AC1                                                 
REMARK 800 EVIDENCE_CODE: SOFTWARE                                              
REMARK 800 SITE_DESCRIPTION: BINDING SITE FOR RESIDUE MG A1014                  
REMARK 800                                                                      
REMARK 800 SITE_IDENTIFIER: AC2                                                 
REMARK 800 EVIDENCE_CODE: SOFTWARE                                              
REMARK 800 SITE_DESCRIPTION: BINDING SITE FOR RESIDUE D1B A1013                 
REMARK 900                                                                      
REMARK 900 RELATED ENTRIES                                                      
REMARK 900 RELATED ID: 2DBE   RELATED DB: PDB                                   
REMARK 900 DNA (5'- D( CP GP CP GP AP AP TP TP CP GP CP GP)-3') COMPLEXED WITH  
REMARK 900 BERENIL (DIMINAZENE ACETURATE) (1,3-BIS(4'-AMIDINOPHENYL)TRIAZENE)   
DBREF  1VZK A    1    12  PDB    1VZK     1VZK             1     12             
DBREF  1VZK B   13    24  PDB    1VZK     1VZK            13     24             
SEQRES   1 A   12   DC  DG  DC  DG  DA  DA  DT  DT  DC  DG  DC  DG              
SEQRES   1 B   12   DC  DG  DC  DG  DA  DA  DT  DT  DC  DG  DC  DG              
HET    D1B  A1013      26                                                       
HET     MG  A1014       1                                                       
HETNAM     D1B 2-(5-{4-[AMINO(IMINO)METHYL]PHENYL}-2-THIENYL)-1H-               
HETNAM   2 D1B  BENZIMIDAZOLE-6- CARBOXIMIDAMIDE DIHYDROCHLORIDE                
HETNAM      MG MAGNESIUM ION                                                    
FORMUL   3  D1B    C19 H16 N6 S                                                 
FORMUL   4   MG    MG 2+                                                        
FORMUL   5  HOH   *60(H2 O)                                                     
LINK        MG    MG A1014                 O   HOH A2016     1555   3655  2.13  
LINK        MG    MG A1014                 O   HOH B2019     1555   1555  2.13  
LINK        MG    MG A1014                 O   HOH A2011     1555   1555  2.12  
LINK        MG    MG A1014                 O   HOH A2015     1555   3655  2.11  
LINK        MG    MG A1014                 O   HOH A2020     1555   3655  2.12  
LINK        MG    MG A1014                 O   HOH A2009     1555   1555  2.13  
SITE     1 AC1  6 HOH A2009  HOH A2011  HOH A2015  HOH A2016                    
SITE     2 AC1  6 HOH A2020  HOH B2019                                          
SITE     1 AC2 10  DA A   6   DT A   7   DT A   8   DC A   9                    
SITE     2 AC2 10 HOH A2034   DA B  17   DA B  18   DT B  19                    
SITE     3 AC2 10  DT B  20   DC B  21                                          
CRYST1   25.677   39.921   65.185  90.00  90.00  90.00 P 21 21 21    8          
ORIGX1      1.000000  0.000000  0.000000        0.00000                         
ORIGX2      0.000000  1.000000  0.000000        0.00000                         
ORIGX3      0.000000  0.000000  1.000000        0.00000                         
SCALE1      0.038945  0.000000  0.000000        0.00000                         
SCALE2      0.000000  0.025049  0.000000        0.00000                         
SCALE3      0.000000  0.000000  0.015341        0.00000                         
ATOM      1  O5'  DC A   1      20.568  34.643  23.693  1.00 25.36           O  
ATOM      2  C5'  DC A   1      19.804  33.450  23.890  1.00 18.97           C  
ATOM      3  C4'  DC A   1      20.742  32.266  23.784  1.00 21.70           C  
ATOM      4  O4'  DC A   1      20.104  31.123  24.385  1.00 16.53           O  
ATOM      5  C3'  DC A   1      21.109  31.859  22.366  1.00 25.41           C  
ATOM      6  O3'  DC A   1      22.485  31.507  22.297  1.00 29.11           O  
ATOM      7  C2'  DC A   1      20.203  30.690  22.078  1.00 25.58           C  
ATOM      8  C1'  DC A   1      20.065  30.051  23.448  1.00 18.32           C  
ATOM      9  N1   DC A   1      18.807  29.371  23.754  1.00 14.87           N  
ATOM     10  C2   DC A   1      18.897  28.103  24.354  1.00 17.38           C  
ATOM     11  O2   DC A   1      20.033  27.654  24.571  1.00 16.36           O  
ATOM     12  N3   DC A   1      17.758  27.445  24.653  1.00 18.93           N  
ATOM     13  C4   DC A   1      16.568  28.002  24.383  1.00 20.53           C  
ATOM     14  N4   DC A   1      15.473  27.302  24.702  1.00 18.90           N  
ATOM     15  C5   DC A   1      16.449  29.290  23.779  1.00 15.25           C  
ATOM     16  C6   DC A   1      17.592  29.924  23.490  1.00 17.71           C  
ATOM     17  P    DG A   2      23.255  31.082  20.962  1.00 32.62           P  
ATOM     18  OP1  DG A   2      24.681  31.489  21.138  1.00 38.19           O  
ATOM     19  OP2  DG A   2      22.477  31.527  19.787  1.00 30.56           O  
ATOM     20  O5'  DG A   2      23.202  29.488  20.982  1.00 33.22           O  
ATOM     21  C5'  DG A   2      24.080  28.755  21.843  1.00 31.48           C  
ATOM     22  C4'  DG A   2      23.978  27.291  21.501  1.00 28.58           C  
ATOM     23  O4'  DG A   2      22.671  26.821  21.888  1.00 26.47           O  
ATOM     24  C3'  DG A   2      24.110  26.939  20.026  1.00 25.65           C  
ATOM     25  O3'  DG A   2      25.000  25.834  19.914  1.00 28.67           O  
ATOM     26  C2'  DG A   2      22.722  26.612  19.559  1.00 21.99           C  
ATOM     27  C1'  DG A   2      22.095  26.065  20.827  1.00 21.58           C  
ATOM     28  N9   DG A   2      20.654  26.246  20.992  1.00 17.66           N  
ATOM     29  C8   DG A   2      19.909  27.332  20.580  1.00 20.58           C  
ATOM     30  N7   DG A   2      18.642  27.194  20.875  1.00 23.05           N  
ATOM     31  C5   DG A   2      18.554  25.961  21.511  1.00 19.30           C  
ATOM     32  C6   DG A   2      17.431  25.289  22.049  1.00 16.93           C  
ATOM     33  O6   DG A   2      16.255  25.695  22.055  1.00 19.03           O  
ATOM     34  N1   DG A   2      17.787  24.061  22.604  1.00 13.48           N  
ATOM     35  C2   DG A   2      19.061  23.549  22.634  1.00 15.98           C  
ATOM     36  N2   DG A   2      19.218  22.349  23.210  1.00 17.96           N  
ATOM     37  N3   DG A   2      20.115  24.165  22.135  1.00 20.05           N  
ATOM     38  C4   DG A   2      19.789  25.363  21.592  1.00 20.07           C  
ATOM     39  P    DC A   3      25.585  25.276  18.534  1.00 30.62           P  
ATOM     40  OP1  DC A   3      27.060  25.288  18.677  1.00 37.04           O  
ATOM     41  OP2  DC A   3      24.889  25.966  17.423  1.00 33.38           O  
ATOM     42  O5'  DC A   3      25.081  23.755  18.538  1.00 28.67           O  
ATOM     43  C5'  DC A   3      25.162  22.978  19.736  1.00 23.94           C  
ATOM     44  C4'  DC A   3      24.072  21.936  19.787  1.00 23.50           C  
ATOM     45  O4'  DC A   3      22.800  22.540  20.100  1.00 23.10           O  
ATOM     46  C3'  DC A   3      23.820  21.202  18.477  1.00 25.60           C  
ATOM     47  O3'  DC A   3      24.686  20.071  18.379  1.00 32.06           O  
ATOM     48  C2'  DC A   3      22.367  20.817  18.534  1.00 26.01           C  
ATOM     49  C1'  DC A   3      21.762  21.715  19.594  1.00 24.49           C  
ATOM     50  N1   DC A   3      20.727  22.632  19.093  1.00 22.43           N  
ATOM     51  C2   DC A   3      19.390  22.374  19.389  1.00 22.08           C  
ATOM     52  O2   DC A   3      19.100  21.374  20.073  1.00 23.13           O  
ATOM     53  N3   DC A   3      18.457  23.230  18.918  1.00 24.96           N  
ATOM     54  C4   DC A   3      18.829  24.290  18.187  1.00 30.21           C  
ATOM     55  N4   DC A   3      17.888  25.125  17.730  1.00 34.79           N  
ATOM     56  C5   DC A   3      20.191  24.574  17.870  1.00 27.52           C  
ATOM     57  C6   DC A   3      21.097  23.716  18.346  1.00 26.15           C  
ATOM     58  P    DG A   4      24.700  19.168  17.042  1.00 32.89           P  
ATOM     59  OP1  DG A   4      25.897  18.293  17.132  1.00 40.23           O  
ATOM     60  OP2  DG A   4      24.528  20.087  15.892  1.00 36.18           O  
ATOM     61  O5'  DG A   4      23.395  18.260  17.156  1.00 30.40           O  
ATOM     62  C5'  DG A   4      23.203  17.358  18.243  1.00 28.38           C  
ATOM     63  C4'  DG A   4      21.932  16.560  18.138  1.00 27.53           C  
ATOM     64  O4'  DG A   4      20.787  17.453  18.171  1.00 29.07           O  
ATOM     65  C3'  DG A   4      21.735  15.749  16.858  1.00 28.44           C  
ATOM     66  O3'  DG A   4      21.166  14.482  17.192  1.00 32.20           O  
ATOM     67  C2'  DG A   4      20.838  16.591  16.001  1.00 29.87           C  
ATOM     68  C1'  DG A   4      19.986  17.341  17.000  1.00 29.92           C  
ATOM     69  N9   DG A   4      19.620  18.722  16.650  1.00 26.83           N  
ATOM     70  C8   DG A   4      20.458  19.642  16.058  1.00 24.72           C  
ATOM     71  N7   DG A   4      19.884  20.786  15.857  1.00 24.00           N  
ATOM     72  C5   DG A   4      18.595  20.625  16.339  1.00 20.20           C  
ATOM     73  C6   DG A   4      17.539  21.577  16.364  1.00 24.91           C  
ATOM     74  O6   DG A   4      17.542  22.750  15.963  1.00 26.18           O  
ATOM     75  N1   DG A   4      16.397  21.030  16.930  1.00 23.74           N  
ATOM     76  C2   DG A   4      16.315  19.740  17.397  1.00 22.52           C  
ATOM     77  N2   DG A   4      15.120  19.412  17.904  1.00 27.95           N  
ATOM     78  N3   DG A   4      17.289  18.849  17.378  1.00 26.17           N  
ATOM     79  C4   DG A   4      18.416  19.356  16.832  1.00 24.75           C  
ATOM     80  P    DA A   5      20.704  13.435  16.052  1.00 32.47           P  
ATOM     81  OP1  DA A   5      20.810  12.084  16.656  1.00 29.95           O  
ATOM     82  OP2  DA A   5      21.381  13.819  14.797  1.00 39.85           O  
ATOM     83  O5'  DA A   5      19.137  13.745  15.894  1.00 30.95           O  
ATOM     84  C5'  DA A   5      18.289  13.418  17.006  1.00 31.83           C  
ATOM     85  C4'  DA A   5      16.876  13.878  16.755  1.00 33.57           C  
ATOM     86  O4'  DA A   5      16.868  15.292  16.415  1.00 33.10           O  
ATOM     87  C3'  DA A   5      16.177  13.155  15.611  1.00 31.14           C  
ATOM     88  O3'  DA A   5      14.892  12.697  16.030  1.00 26.91           O  
ATOM     89  C2'  DA A   5      16.083  14.170  14.496  1.00 30.57           C  
ATOM     90  C1'  DA A   5      16.038  15.473  15.262  1.00 32.24           C  
ATOM     91  N9   DA A   5      16.613  16.651  14.618  1.00 28.78           N  
ATOM     92  C8   DA A   5      17.861  16.763  14.054  1.00 28.46           C  
ATOM     93  N7   DA A   5      18.094  17.956  13.552  1.00 28.67           N  
ATOM     94  C5   DA A   5      16.921  18.663  13.808  1.00 27.09           C  
ATOM     95  C6   DA A   5      16.538  19.987  13.523  1.00 27.83           C  
ATOM     96  N6   DA A   5      17.310  20.874  12.895  1.00 25.43           N  
ATOM     97  N1   DA A   5      15.301  20.367  13.916  1.00 26.23           N  
ATOM     98  C2   DA A   5      14.531  19.471  14.546  1.00 30.43           C  
ATOM     99  N3   DA A   5      14.763  18.199  14.878  1.00 30.41           N  
ATOM    100  C4   DA A   5      16.001  17.872  14.465  1.00 28.83           C  
ATOM    101  P    DA A   6      14.002  11.809  15.039  1.00 30.20           P  
ATOM    102  OP1  DA A   6      13.161  10.897  15.862  1.00 23.17           O  
ATOM    103  OP2  DA A   6      14.904  11.260  13.995  1.00 24.75           O  
ATOM    104  O5'  DA A   6      13.045  12.868  14.319  1.00 23.39           O  
ATOM    105  C5'  DA A   6      12.151  13.686  15.082  1.00 23.66           C  
ATOM    106  C4'  DA A   6      11.511  14.689  14.153  1.00 21.82           C  
ATOM    107  O4'  DA A   6      12.457  15.652  13.667  1.00 22.10           O  
ATOM    108  C3'  DA A   6      10.904  14.023  12.912  1.00 19.53           C  
ATOM    109  O3'  DA A   6       9.490  14.163  13.003  1.00 20.52           O  
ATOM    110  C2'  DA A   6      11.543  14.724  11.741  1.00 20.52           C  
ATOM    111  C1'  DA A   6      12.094  16.005  12.314  1.00 17.68           C  
ATOM    112  N9   DA A   6      13.330  16.571  11.780  1.00 17.45           N  
ATOM    113  C8   DA A   6      14.508  15.899  11.530  1.00 20.46           C  
ATOM    114  N7   DA A   6      15.459  16.664  11.051  1.00 18.61           N  
ATOM    115  C5   DA A   6      14.874  17.917  10.984  1.00 18.83           C  
ATOM    116  C6   DA A   6      15.365  19.164  10.557  1.00 19.99           C  
ATOM    117  N6   DA A   6      16.606  19.387  10.096  1.00 18.25           N  
ATOM    118  N1   DA A   6      14.507  20.200  10.625  1.00 20.07           N  
ATOM    119  C2   DA A   6      13.260  20.022  11.079  1.00 17.22           C  
ATOM    120  N3   DA A   6      12.688  18.900  11.506  1.00 18.20           N  
ATOM    121  C4   DA A   6      13.564  17.874  11.430  1.00 18.87           C  
ATOM    122  P    DT A   7       8.431  13.716  11.881  1.00 19.84           P  
ATOM    123  OP1  DT A   7       7.122  13.587  12.575  1.00 21.06           O  
ATOM    124  OP2  DT A   7       9.010  12.641  11.066  1.00 23.31           O  
ATOM    125  O5'  DT A   7       8.362  15.021  10.954  1.00 24.72           O  
ATOM    126  C5'  DT A   7       7.962  16.300  11.453  1.00 21.66           C  
ATOM    127  C4'  DT A   7       8.248  17.349  10.395  1.00 19.12           C  
ATOM    128  O4'  DT A   7       9.658  17.437  10.123  1.00 17.38           O  
ATOM    129  C3'  DT A   7       7.596  17.065   9.048  1.00 17.50           C  
ATOM    130  O3'  DT A   7       6.504  17.974   8.888  1.00 19.79           O  
ATOM    131  C2'  DT A   7       8.692  17.232   8.022  1.00 18.04           C  
ATOM    132  C1'  DT A   7       9.784  17.956   8.785  1.00 17.80           C  
ATOM    133  N1   DT A   7      11.191  17.724   8.456  1.00 17.74           N  
ATOM    134  C2   DT A   7      11.945  18.819   8.092  1.00 18.40           C  
ATOM    135  O2   DT A   7      11.524  19.957   8.027  1.00 19.48           O  
ATOM    136  N3   DT A   7      13.251  18.554   7.792  1.00 20.71           N  
ATOM    137  C4   DT A   7      13.873  17.326   7.818  1.00 19.80           C  
ATOM    138  O4   DT A   7      15.060  17.285   7.516  1.00 17.83           O  
ATOM    139  C5   DT A   7      13.031  16.210   8.206  1.00 16.09           C  
ATOM    140  C7   DT A   7      13.657  14.848   8.251  1.00 16.69           C  
ATOM    141  C6   DT A   7      11.749  16.455   8.503  1.00 15.93           C  
ATOM    142  P    DT A   8       5.493  17.985   7.653  1.00 25.56           P  
ATOM    143  OP1  DT A   8       4.201  18.564   8.143  1.00 30.23           O  
ATOM    144  OP2  DT A   8       5.452  16.632   7.044  1.00 23.91           O  
ATOM    145  O5'  DT A   8       6.125  18.998   6.614  1.00 20.33           O  
ATOM    146  C5'  DT A   8       6.327  20.374   6.966  1.00 20.55           C  
ATOM    147  C4'  DT A   8       7.218  21.027   5.939  1.00 21.92           C  
ATOM    148  O4'  DT A   8       8.532  20.438   5.927  1.00 24.18           O  
ATOM    149  C3'  DT A   8       6.718  20.879   4.501  1.00 20.78           C  
ATOM    150  O3'  DT A   8       6.201  22.149   4.106  1.00 24.68           O  
ATOM    151  C2'  DT A   8       7.900  20.406   3.693  1.00 19.11           C  
ATOM    152  C1'  DT A   8       9.084  20.600   4.608  1.00 19.31           C  
ATOM    153  N1   DT A   8      10.193  19.639   4.581  1.00 19.57           N  
ATOM    154  C2   DT A   8      11.461  20.127   4.360  1.00 20.95           C  
ATOM    155  O2   DT A   8      11.705  21.306   4.185  1.00 20.62           O  
ATOM    156  N3   DT A   8      12.467  19.196   4.347  1.00 19.59           N  
ATOM    157  C4   DT A   8      12.345  17.832   4.529  1.00 23.17           C  
ATOM    158  O4   DT A   8      13.352  17.122   4.486  1.00 18.75           O  
ATOM    159  C5   DT A   8      10.995  17.373   4.758  1.00 21.84           C  
ATOM    160  C7   DT A   8      10.793  15.903   4.963  1.00 17.20           C  
ATOM    161  C6   DT A   8      10.001  18.281   4.775  1.00 24.41           C  
ATOM    162  P    DC A   9       5.582  22.474   2.683  1.00 27.99           P  
ATOM    163  OP1  DC A   9       4.552  23.543   2.888  1.00 34.78           O  
ATOM    164  OP2  DC A   9       5.252  21.226   1.964  1.00 22.80           O  
ATOM    165  O5'  DC A   9       6.793  23.177   1.905  1.00 29.29           O  
ATOM    166  C5'  DC A   9       7.585  24.155   2.598  1.00 30.15           C  
ATOM    167  C4'  DC A   9       8.853  24.408   1.814  1.00 27.28           C  
ATOM    168  O4'  DC A   9       9.781  23.321   1.942  1.00 26.47           O  
ATOM    169  C3'  DC A   9       8.601  24.564   0.313  1.00 26.76           C  
ATOM    170  O3'  DC A   9       8.858  25.923  -0.040  1.00 29.46           O  
ATOM    171  C2'  DC A   9       9.517  23.582  -0.362  1.00 26.14           C  
ATOM    172  C1'  DC A   9      10.478  23.112   0.702  1.00 22.53           C  
ATOM    173  N1   DC A   9      10.847  21.690   0.792  1.00 19.19           N  
ATOM    174  C2   DC A   9      12.165  21.282   0.589  1.00 21.65           C  
ATOM    175  O2   DC A   9      13.064  22.087   0.322  1.00 16.56           O  
ATOM    176  N3   DC A   9      12.481  19.961   0.681  1.00 20.48           N  
ATOM    177  C4   DC A   9      11.532  19.063   0.968  1.00 17.21           C  
ATOM    178  N4   DC A   9      11.878  17.782   1.051  1.00 11.35           N  
ATOM    179  C5   DC A   9      10.181  19.458   1.182  1.00 19.96           C  
ATOM    180  C6   DC A   9       9.893  20.758   1.087  1.00 19.93           C  
ATOM    181  P    DG A  10       8.346  26.532  -1.424  1.00 31.14           P  
ATOM    182  OP1  DG A  10       8.353  28.010  -1.311  1.00 30.43           O  
ATOM    183  OP2  DG A  10       7.122  25.800  -1.841  1.00 33.56           O  
ATOM    184  O5'  DG A  10       9.503  26.117  -2.458  1.00 25.16           O  
ATOM    185  C5'  DG A  10      10.853  26.559  -2.244  1.00 20.36           C  
ATOM    186  C4'  DG A  10      11.749  25.798  -3.201  1.00 26.03           C  
ATOM    187  O4'  DG A  10      11.830  24.409  -2.762  1.00 26.34           O  
ATOM    188  C3'  DG A  10      11.290  25.722  -4.635  1.00 27.70           C  
ATOM    189  O3'  DG A  10      12.365  25.702  -5.565  1.00 30.94           O  
ATOM    190  C2'  DG A  10      10.544  24.403  -4.683  1.00 27.81           C  
ATOM    191  C1'  DG A  10      11.565  23.581  -3.903  1.00 25.92           C  
ATOM    192  N9   DG A  10      11.127  22.262  -3.454  1.00 28.13           N  
ATOM    193  C8   DG A  10       9.868  21.805  -3.149  1.00 26.91           C  
ATOM    194  N7   DG A  10       9.856  20.550  -2.777  1.00 21.58           N  
ATOM    195  C5   DG A  10      11.183  20.149  -2.836  1.00 21.60           C  
ATOM    196  C6   DG A  10      11.786  18.892  -2.545  1.00 20.82           C  
ATOM    197  O6   DG A  10      11.226  17.853  -2.162  1.00 16.51           O  
ATOM    198  N1   DG A  10      13.164  18.920  -2.739  1.00 17.19           N  
ATOM    199  C2   DG A  10      13.863  20.026  -3.161  1.00 22.81           C  
ATOM    200  N2   DG A  10      15.194  19.876  -3.296  1.00 21.80           N  
ATOM    201  N3   DG A  10      13.303  21.201  -3.432  1.00 19.83           N  
ATOM    202  C4   DG A  10      11.980  21.183  -3.249  1.00 20.50           C  
ATOM    203  P    DC A  11      12.755  27.023  -6.411  1.00 33.40           P  
ATOM    204  OP1  DC A  11      12.506  28.181  -5.527  1.00 28.10           O  
ATOM    205  OP2  DC A  11      12.084  26.923  -7.734  1.00 32.83           O  
ATOM    206  O5'  DC A  11      14.313  26.801  -6.612  1.00 29.91           O  
ATOM    207  C5'  DC A  11      15.244  26.821  -5.531  1.00 27.83           C  
ATOM    208  C4'  DC A  11      16.263  25.714  -5.660  1.00 27.61           C  
ATOM    209  O4'  DC A  11      15.649  24.412  -5.532  1.00 27.34           O  
ATOM    210  C3'  DC A  11      16.976  25.614  -7.005  1.00 30.51           C  
ATOM    211  O3'  DC A  11      18.333  25.236  -6.793  1.00 30.93           O  
ATOM    212  C2'  DC A  11      16.171  24.588  -7.767  1.00 33.10           C  
ATOM    213  C1'  DC A  11      15.926  23.576  -6.668  1.00 28.90           C  
ATOM    214  N1   DC A  11      14.752  22.715  -6.650  1.00 26.40           N  
ATOM    215  C2   DC A  11      14.905  21.359  -6.362  1.00 22.13           C  
ATOM    216  O2   DC A  11      16.032  20.919  -6.137  1.00 16.74           O  
ATOM    217  N3   DC A  11      13.824  20.559  -6.339  1.00 21.90           N  
ATOM    218  C4   DC A  11      12.614  21.068  -6.587  1.00 27.75           C  
ATOM    219  N4   DC A  11      11.564  20.239  -6.554  1.00 18.17           N  
ATOM    220  C5   DC A  11      12.425  22.448  -6.880  1.00 29.63           C  
ATOM    221  C6   DC A  11      13.509  23.234  -6.900  1.00 30.21           C  
ATOM    222  P    DG A  12      19.450  25.613  -7.883  1.00 36.09           P  
ATOM    223  OP1  DG A  12      20.692  25.941  -7.141  1.00 38.41           O  
ATOM    224  OP2  DG A  12      18.857  26.608  -8.825  1.00 29.01           O  
ATOM    225  O5'  DG A  12      19.649  24.272  -8.689  1.00 33.50           O  
ATOM    226  C5'  DG A  12      20.411  23.157  -8.206  1.00 30.21           C  
ATOM    227  C4'  DG A  12      20.209  22.032  -9.196  1.00 25.64           C  
ATOM    228  O4'  DG A  12      18.895  21.475  -9.068  1.00 23.33           O  
ATOM    229  C3'  DG A  12      20.305  22.472 -10.647  1.00 23.04           C  
ATOM    230  O3'  DG A  12      21.551  22.047 -11.200  1.00 24.48           O  
ATOM    231  C2'  DG A  12      19.149  21.829 -11.362  1.00 24.49           C  
ATOM    232  C1'  DG A  12      18.476  20.954 -10.334  1.00 21.71           C  
ATOM    233  N9   DG A  12      17.006  20.976 -10.272  1.00 21.02           N  
ATOM    234  C8   DG A  12      16.167  22.048 -10.483  1.00 23.77           C  
ATOM    235  N7   DG A  12      14.903  21.745 -10.353  1.00 23.93           N  
ATOM    236  C5   DG A  12      14.909  20.393 -10.038  1.00 26.07           C  
ATOM    237  C6   DG A  12      13.827  19.509  -9.781  1.00 27.15           C  
ATOM    238  O6   DG A  12      12.614  19.761  -9.783  1.00 31.43           O  
ATOM    239  N1   DG A  12      14.268  18.220  -9.500  1.00 22.74           N  
ATOM    240  C2   DG A  12      15.586  17.833  -9.470  1.00 22.65           C  
ATOM    241  N2   DG A  12      15.808  16.546  -9.180  1.00 16.76           N  
ATOM    242  N3   DG A  12      16.602  18.648  -9.708  1.00 25.46           N  
ATOM    243  C4   DG A  12      16.197  19.906  -9.984  1.00 23.31           C  
TER     244       DG A  12                                                      
ATOM    245  O5'  DC B  13       8.720   9.588  -9.060  1.00 49.73           O  
ATOM    246  C5'  DC B  13       9.230  10.684  -9.816  1.00 42.01           C  
ATOM    247  C4'  DC B  13      10.712  10.822  -9.541  1.00 40.14           C  
ATOM    248  O4'  DC B  13      11.134  12.197  -9.686  1.00 35.44           O  
ATOM    249  C3'  DC B  13      11.093  10.394  -8.135  1.00 40.80           C  
ATOM    250  O3'  DC B  13      12.317   9.658  -8.145  1.00 41.33           O  
ATOM    251  C2'  DC B  13      11.206  11.696  -7.386  1.00 40.91           C  
ATOM    252  C1'  DC B  13      11.708  12.649  -8.456  1.00 37.70           C  
ATOM    253  N1   DC B  13      11.306  14.051  -8.315  1.00 36.59           N  
ATOM    254  C2   DC B  13      12.282  15.036  -8.498  1.00 31.45           C  
ATOM    255  O2   DC B  13      13.419  14.666  -8.767  1.00 24.54           O  
ATOM    256  N3   DC B  13      11.979  16.340  -8.386  1.00 35.71           N  
ATOM    257  C4   DC B  13      10.725  16.701  -8.092  1.00 37.95           C  
ATOM    258  N4   DC B  13      10.479  18.008  -7.989  1.00 28.82           N  
ATOM    259  C5   DC B  13       9.707  15.727  -7.898  1.00 37.74           C  
ATOM    260  C6   DC B  13      10.032  14.436  -8.017  1.00 39.97           C  
ATOM    261  P    DG B  14      12.628   8.682  -6.892  1.00 39.43           P  
ATOM    262  OP1  DG B  14      13.208   7.443  -7.450  1.00 40.64           O  
ATOM    263  OP2  DG B  14      11.443   8.746  -6.009  1.00 35.83           O  
ATOM    264  O5'  DG B  14      13.821   9.451  -6.134  1.00 36.10           O  
ATOM    265  C5'  DG B  14      15.051   9.540  -6.875  1.00 31.96           C  
ATOM    266  C4'  DG B  14      15.886  10.672  -6.340  1.00 25.83           C  
ATOM    267  O4'  DG B  14      15.235  11.933  -6.557  1.00 25.11           O  
ATOM    268  C3'  DG B  14      16.120  10.556  -4.836  1.00 24.60           C  
ATOM    269  O3'  DG B  14      17.483  10.221  -4.612  1.00 21.74           O  
ATOM    270  C2'  DG B  14      15.723  11.901  -4.288  1.00 26.60           C  
ATOM    271  C1'  DG B  14      15.582  12.808  -5.485  1.00 24.85           C  
ATOM    272  N9   DG B  14      14.520  13.817  -5.409  1.00 23.87           N  
ATOM    273  C8   DG B  14      13.192  13.560  -5.130  1.00 24.83           C  
ATOM    274  N7   DG B  14      12.454  14.639  -5.121  1.00 19.93           N  
ATOM    275  C5   DG B  14      13.344  15.652  -5.410  1.00 17.51           C  
ATOM    276  C6   DG B  14      13.092  17.039  -5.530  1.00 17.45           C  
ATOM    277  O6   DG B  14      11.999  17.587  -5.392  1.00 22.57           O  
ATOM    278  N1   DG B  14      14.242  17.755  -5.831  1.00 15.92           N  
ATOM    279  C2   DG B  14      15.484  17.187  -5.994  1.00 18.97           C  
ATOM    280  N2   DG B  14      16.467  18.056  -6.283  1.00 14.13           N  
ATOM    281  N3   DG B  14      15.730  15.888  -5.883  1.00 19.77           N  
ATOM    282  C4   DG B  14      14.624  15.172  -5.591  1.00 17.94           C  
ATOM    283  P    DC B  15      18.200  10.145  -3.193  1.00 25.62           P  
ATOM    284  OP1  DC B  15      19.415   9.310  -3.343  1.00 21.55           O  
ATOM    285  OP2  DC B  15      17.186   9.843  -2.149  1.00 25.25           O  
ATOM    286  O5'  DC B  15      18.680  11.651  -2.950  1.00 21.19           O  
ATOM    287  C5'  DC B  15      19.553  12.315  -3.873  1.00 24.34           C  
ATOM    288  C4'  DC B  15      19.584  13.802  -3.588  1.00 17.52           C  
ATOM    289  O4'  DC B  15      18.288  14.395  -3.797  1.00 19.59           O  
ATOM    290  C3'  DC B  15      19.910  14.168  -2.160  1.00 21.94           C  
ATOM    291  O3'  DC B  15      21.314  14.352  -2.012  1.00 24.92           O  
ATOM    292  C2'  DC B  15      19.183  15.459  -1.882  1.00 22.72           C  
ATOM    293  C1'  DC B  15      18.136  15.553  -2.956  1.00 18.66           C  
ATOM    294  N1   DC B  15      16.730  15.493  -2.530  1.00 15.81           N  
ATOM    295  C2   DC B  15      15.963  16.650  -2.561  1.00 16.29           C  
ATOM    296  O2   DC B  15      16.533  17.673  -2.955  1.00 21.33           O  
ATOM    297  N3   DC B  15      14.659  16.629  -2.176  1.00 18.02           N  
ATOM    298  C4   DC B  15      14.130  15.466  -1.764  1.00 21.97           C  
ATOM    299  N4   DC B  15      12.853  15.427  -1.380  1.00 29.32           N  
ATOM    300  C5   DC B  15      14.892  14.265  -1.719  1.00 22.03           C  
ATOM    301  C6   DC B  15      16.174  14.320  -2.105  1.00 19.20           C  
ATOM    302  P    DG B  16      21.942  14.540  -0.565  1.00 30.90           P  
ATOM    303  OP1  DG B  16      23.306  13.939  -0.601  1.00 35.74           O  
ATOM    304  OP2  DG B  16      20.970  14.033   0.442  1.00 29.04           O  
ATOM    305  O5'  DG B  16      22.067  16.102  -0.383  1.00 28.06           O  
ATOM    306  C5'  DG B  16      22.696  16.986  -1.316  1.00 25.40           C  
ATOM    307  C4'  DG B  16      22.265  18.403  -1.003  1.00 26.18           C  
ATOM    308  O4'  DG B  16      20.827  18.452  -0.995  1.00 24.54           O  
ATOM    309  C3'  DG B  16      22.685  18.958   0.354  1.00 28.91           C  
ATOM    310  O3'  DG B  16      23.091  20.316   0.213  1.00 30.01           O  
ATOM    311  C2'  DG B  16      21.470  18.808   1.234  1.00 28.45           C  
ATOM    312  C1'  DG B  16      20.337  18.988   0.232  1.00 26.50           C  
ATOM    313  N9   DG B  16      19.087  18.280   0.539  1.00 21.04           N  
ATOM    314  C8   DG B  16      18.923  17.006   1.021  1.00 19.04           C  
ATOM    315  N7   DG B  16      17.678  16.670   1.187  1.00 18.43           N  
ATOM    316  C5   DG B  16      16.962  17.791   0.791  1.00 13.81           C  
ATOM    317  C6   DG B  16      15.564  18.000   0.758  1.00 17.73           C  
ATOM    318  O6   DG B  16      14.668  17.203   1.086  1.00 20.35           O  
ATOM    319  N1   DG B  16      15.246  19.275   0.291  1.00 20.86           N  
ATOM    320  C2   DG B  16      16.190  20.204  -0.089  1.00 22.59           C  
ATOM    321  N2   DG B  16      15.731  21.382  -0.515  1.00 15.57           N  
ATOM    322  N3   DG B  16      17.500  20.018  -0.062  1.00 22.30           N  
ATOM    323  C4   DG B  16      17.815  18.788   0.389  1.00 19.71           C  
ATOM    324  P    DA B  17      23.169  21.346   1.434  1.00 31.34           P  
ATOM    325  OP1  DA B  17      24.284  22.289   1.131  1.00 39.18           O  
ATOM    326  OP2  DA B  17      23.140  20.587   2.707  1.00 34.12           O  
ATOM    327  O5'  DA B  17      21.813  22.194   1.338  1.00 24.13           O  
ATOM    328  C5'  DA B  17      21.383  22.705   0.077  1.00 23.36           C  
ATOM    329  C4'  DA B  17      20.210  23.633   0.234  1.00 23.93           C  
ATOM    330  O4'  DA B  17      19.015  22.955   0.667  1.00 22.79           O  
ATOM    331  C3'  DA B  17      20.414  24.726   1.299  1.00 26.96           C  
ATOM    332  O3'  DA B  17      19.756  25.903   0.839  1.00 30.58           O  
ATOM    333  C2'  DA B  17      19.857  24.112   2.549  1.00 26.99           C  
ATOM    334  C1'  DA B  17      18.703  23.287   2.041  1.00 23.61           C  
ATOM    335  N9   DA B  17      18.443  21.947   2.587  1.00 19.43           N  
ATOM    336  C8   DA B  17      19.284  20.918   2.916  1.00 16.02           C  
ATOM    337  N7   DA B  17      18.669  19.851   3.380  1.00 17.16           N  
ATOM    338  C5   DA B  17      17.327  20.203   3.349  1.00 20.29           C  
ATOM    339  C6   DA B  17      16.145  19.522   3.708  1.00 18.99           C  
ATOM    340  N6   DA B  17      16.131  18.276   4.194  1.00 18.04           N  
ATOM    341  N1   DA B  17      14.974  20.181   3.546  1.00 18.65           N  
ATOM    342  C2   DA B  17      14.978  21.431   3.060  1.00 21.19           C  
ATOM    343  N3   DA B  17      16.023  22.177   2.687  1.00 18.77           N  
ATOM    344  C4   DA B  17      17.165  21.487   2.864  1.00 19.47           C  
ATOM    345  P    DA B  18      19.792  27.278   1.660  1.00 34.91           P  
ATOM    346  OP1  DA B  18      19.495  28.367   0.686  1.00 35.58           O  
ATOM    347  OP2  DA B  18      20.988  27.270   2.527  1.00 35.00           O  
ATOM    348  O5'  DA B  18      18.513  27.155   2.625  1.00 30.79           O  
ATOM    349  C5'  DA B  18      17.211  27.022   2.030  1.00 28.86           C  
ATOM    350  C4'  DA B  18      16.197  26.801   3.128  1.00 28.37           C  
ATOM    351  O4'  DA B  18      16.266  25.457   3.633  1.00 28.29           O  
ATOM    352  C3'  DA B  18      16.412  27.717   4.335  1.00 28.72           C  
ATOM    353  O3'  DA B  18      15.366  28.687   4.338  1.00 34.24           O  
ATOM    354  C2'  DA B  18      16.424  26.798   5.526  1.00 28.31           C  
ATOM    355  C1'  DA B  18      15.877  25.478   5.028  1.00 26.63           C  
ATOM    356  N9   DA B  18      16.406  24.209   5.516  1.00 22.64           N  
ATOM    357  C8   DA B  18      17.730  23.865   5.672  1.00 19.68           C  
ATOM    358  N7   DA B  18      17.893  22.644   6.130  1.00 17.92           N  
ATOM    359  C5   DA B  18      16.607  22.148   6.288  1.00 16.91           C  
ATOM    360  C6   DA B  18      16.137  20.903   6.743  1.00 21.62           C  
ATOM    361  N6   DA B  18      16.929  19.895   7.137  1.00 20.74           N  
ATOM    362  N1   DA B  18      14.798  20.712   6.785  1.00 22.34           N  
ATOM    363  C2   DA B  18      14.018  21.728   6.389  1.00 23.38           C  
ATOM    364  N3   DA B  18      14.346  22.940   5.944  1.00 21.68           N  
ATOM    365  C4   DA B  18      15.682  23.099   5.913  1.00 20.45           C  
ATOM    366  P    DT B  19      14.949  29.597   5.588  1.00 34.61           P  
ATOM    367  OP1  DT B  19      14.032  30.648   5.068  1.00 36.88           O  
ATOM    368  OP2  DT B  19      16.150  29.939   6.373  1.00 25.88           O  
ATOM    369  O5'  DT B  19      14.071  28.609   6.501  1.00 31.46           O  
ATOM    370  C5'  DT B  19      12.778  28.217   6.024  1.00 29.92           C  
ATOM    371  C4'  DT B  19      12.174  27.241   7.004  1.00 28.82           C  
ATOM    372  O4'  DT B  19      13.068  26.130   7.218  1.00 30.34           O  
ATOM    373  C3'  DT B  19      11.908  27.832   8.387  1.00 24.06           C  
ATOM    374  O3'  DT B  19      10.498  27.964   8.543  1.00 25.64           O  
ATOM    375  C2'  DT B  19      12.535  26.876   9.362  1.00 25.15           C  
ATOM    376  C1'  DT B  19      12.802  25.629   8.534  1.00 25.13           C  
ATOM    377  N1   DT B  19      13.969  24.795   8.856  1.00 23.66           N  
ATOM    378  C2   DT B  19      13.754  23.510   9.284  1.00 15.53           C  
ATOM    379  O2   DT B  19      12.641  23.025   9.414  1.00 17.46           O  
ATOM    380  N3   DT B  19      14.891  22.799   9.562  1.00 17.63           N  
ATOM    381  C4   DT B  19      16.199  23.237   9.455  1.00 20.79           C  
ATOM    382  O4   DT B  19      17.127  22.478   9.742  1.00 21.60           O  
ATOM    383  C5   DT B  19      16.355  24.597   8.997  1.00 21.61           C  
ATOM    384  C7   DT B  19      17.743  25.146   8.855  1.00 23.28           C  
ATOM    385  C6   DT B  19      15.251  25.295   8.725  1.00 22.48           C  
ATOM    386  P    DT B  20       9.848  28.696   9.812  1.00 28.47           P  
ATOM    387  OP1  DT B  20       8.502  29.173   9.415  1.00 32.39           O  
ATOM    388  OP2  DT B  20      10.872  29.598  10.391  1.00 23.82           O  
ATOM    389  O5'  DT B  20       9.625  27.487  10.845  1.00 26.18           O  
ATOM    390  C5'  DT B  20       8.814  26.373  10.465  1.00 20.87           C  
ATOM    391  C4'  DT B  20       9.007  25.242  11.435  1.00 23.05           C  
ATOM    392  O4'  DT B  20      10.371  24.765  11.388  1.00 24.23           O  
ATOM    393  C3'  DT B  20       8.762  25.605  12.901  1.00 24.66           C  
ATOM    394  O3'  DT B  20       7.553  24.976  13.317  1.00 27.84           O  
ATOM    395  C2'  DT B  20       9.963  25.122  13.662  1.00 21.85           C  
ATOM    396  C1'  DT B  20      10.663  24.206  12.676  1.00 24.65           C  
ATOM    397  N1   DT B  20      12.130  24.120  12.697  1.00 26.27           N  
ATOM    398  C2   DT B  20      12.696  22.881  12.940  1.00 22.98           C  
ATOM    399  O2   DT B  20      12.056  21.869  13.142  1.00 26.25           O  
ATOM    400  N3   DT B  20      14.067  22.887  12.942  1.00 19.38           N  
ATOM    401  C4   DT B  20      14.900  23.965  12.727  1.00 19.37           C  
ATOM    402  O4   DT B  20      16.104  23.768  12.767  1.00 28.33           O  
ATOM    403  C5   DT B  20      14.250  25.235  12.474  1.00 23.44           C  
ATOM    404  C7   DT B  20      15.056  26.475  12.229  1.00 19.54           C  
ATOM    405  C6   DT B  20      12.907  25.238  12.472  1.00 26.86           C  
ATOM    406  P    DC B  21       6.878  25.195  14.748  1.00 30.44           P  
ATOM    407  OP1  DC B  21       5.447  24.843  14.613  1.00 33.84           O  
ATOM    408  OP2  DC B  21       7.282  26.517  15.276  1.00 40.51           O  
ATOM    409  O5'  DC B  21       7.584  24.068  15.645  1.00 27.85           O  
ATOM    410  C5'  DC B  21       7.390  22.693  15.290  1.00 22.54           C  
ATOM    411  C4'  DC B  21       8.239  21.810  16.167  1.00 22.38           C  
ATOM    412  O4'  DC B  21       9.625  22.068  15.865  1.00 24.87           O  
ATOM    413  C3'  DC B  21       8.098  22.036  17.665  1.00 26.22           C  
ATOM    414  O3'  DC B  21       7.516  20.868  18.251  1.00 27.61           O  
ATOM    415  C2'  DC B  21       9.488  22.320  18.185  1.00 26.64           C  
ATOM    416  C1'  DC B  21      10.395  21.856  17.070  1.00 27.05           C  
ATOM    417  N1   DC B  21      11.644  22.574  16.799  1.00 25.04           N  
ATOM    418  C2   DC B  21      12.849  21.871  16.855  1.00 24.88           C  
ATOM    419  O2   DC B  21      12.836  20.666  17.138  1.00 25.98           O  
ATOM    420  N3   DC B  21      14.002  22.530  16.602  1.00 24.41           N  
ATOM    421  C4   DC B  21      13.979  23.831  16.300  1.00 19.49           C  
ATOM    422  N4   DC B  21      15.148  24.426  16.060  1.00 18.74           N  
ATOM    423  C5   DC B  21      12.765  24.577  16.229  1.00 19.59           C  
ATOM    424  C6   DC B  21      11.631  23.913  16.483  1.00 20.30           C  
ATOM    425  P    DG B  22       6.822  20.961  19.683  1.00 30.42           P  
ATOM    426  OP1  DG B  22       5.810  19.888  19.778  1.00 32.71           O  
ATOM    427  OP2  DG B  22       6.458  22.377  19.932  1.00 31.61           O  
ATOM    428  O5'  DG B  22       7.997  20.594  20.703  1.00 28.77           O  
ATOM    429  C5'  DG B  22       8.733  19.377  20.536  1.00 25.36           C  
ATOM    430  C4'  DG B  22       9.980  19.492  21.377  1.00 26.74           C  
ATOM    431  O4'  DG B  22      10.933  20.371  20.752  1.00 25.49           O  
ATOM    432  C3'  DG B  22       9.708  20.071  22.760  1.00 28.45           C  
ATOM    433  O3'  DG B  22      10.404  19.317  23.737  1.00 33.69           O  
ATOM    434  C2'  DG B  22      10.191  21.496  22.644  1.00 26.60           C  
ATOM    435  C1'  DG B  22      11.413  21.252  21.769  1.00 24.16           C  
ATOM    436  N9   DG B  22      11.997  22.413  21.094  1.00 24.69           N  
ATOM    437  C8   DG B  22      11.457  23.609  20.701  1.00 23.60           C  
ATOM    438  N7   DG B  22      12.329  24.391  20.120  1.00 26.79           N  
ATOM    439  C5   DG B  22      13.515  23.667  20.130  1.00 25.13           C  
ATOM    440  C6   DG B  22      14.814  23.974  19.648  1.00 20.85           C  
ATOM    441  O6   DG B  22      15.223  24.992  19.082  1.00 19.90           O  
ATOM    442  N1   DG B  22      15.681  22.921  19.889  1.00 20.79           N  
ATOM    443  C2   DG B  22      15.389  21.730  20.500  1.00 21.07           C  
ATOM    444  N2   DG B  22      16.399  20.857  20.623  1.00 23.27           N  
ATOM    445  N3   DG B  22      14.190  21.423  20.955  1.00 21.80           N  
ATOM    446  C4   DG B  22      13.333  22.445  20.725  1.00 24.64           C  
ATOM    447  P    DC B  23       9.945  19.198  25.258  1.00 36.39           P  
ATOM    448  OP1  DC B  23       9.049  18.020  25.369  1.00 26.02           O  
ATOM    449  OP2  DC B  23       9.582  20.532  25.779  1.00 37.30           O  
ATOM    450  O5'  DC B  23      11.336  18.763  25.965  1.00 34.59           O  
ATOM    451  C5'  DC B  23      11.896  17.512  25.547  1.00 25.77           C  
ATOM    452  C4'  DC B  23      13.391  17.613  25.401  1.00 26.01           C  
ATOM    453  O4'  DC B  23      13.703  18.532  24.330  1.00 24.03           O  
ATOM    454  C3'  DC B  23      14.142  18.169  26.593  1.00 25.38           C  
ATOM    455  O3'  DC B  23      14.505  17.145  27.511  1.00 25.71           O  
ATOM    456  C2'  DC B  23      15.367  18.774  25.995  1.00 22.11           C  
ATOM    457  C1'  DC B  23      14.949  19.175  24.608  1.00 23.60           C  
ATOM    458  N1   DC B  23      14.665  20.609  24.392  1.00 19.03           N  
ATOM    459  C2   DC B  23      15.734  21.425  24.023  1.00 18.73           C  
ATOM    460  O2   DC B  23      16.844  20.874  23.912  1.00 21.47           O  
ATOM    461  N3   DC B  23      15.496  22.738  23.817  1.00 17.65           N  
ATOM    462  C4   DC B  23      14.274  23.232  23.957  1.00 19.03           C  
ATOM    463  N4   DC B  23      14.074  24.526  23.750  1.00 14.20           N  
ATOM    464  C5   DC B  23      13.165  22.408  24.335  1.00 23.34           C  
ATOM    465  C6   DC B  23      13.410  21.108  24.537  1.00 20.13           C  
ATOM    466  P    DG B  24      14.786  17.484  29.058  1.00 29.49           P  
ATOM    467  OP1  DG B  24      14.795  16.182  29.760  1.00 23.05           O  
ATOM    468  OP2  DG B  24      13.916  18.607  29.480  1.00 32.13           O  
ATOM    469  O5'  DG B  24      16.280  18.068  29.061  1.00 28.07           O  
ATOM    470  C5'  DG B  24      17.382  17.250  28.649  1.00 24.11           C  
ATOM    471  C4'  DG B  24      18.580  18.124  28.399  1.00 22.27           C  
ATOM    472  O4'  DG B  24      18.347  18.988  27.256  1.00 22.63           O  
ATOM    473  C3'  DG B  24      18.931  19.079  29.531  1.00 18.19           C  
ATOM    474  O3'  DG B  24      19.639  18.412  30.571  1.00 17.03           O  
ATOM    475  C2'  DG B  24      19.755  20.115  28.810  1.00 18.55           C  
ATOM    476  C1'  DG B  24      19.043  20.227  27.472  1.00 20.91           C  
ATOM    477  N9   DG B  24      18.023  21.276  27.380  1.00 18.21           N  
ATOM    478  C8   DG B  24      16.711  21.196  27.777  1.00 24.25           C  
ATOM    479  N7   DG B  24      16.036  22.298  27.569  1.00 23.58           N  
ATOM    480  C5   DG B  24      16.976  23.148  27.000  1.00 17.65           C  
ATOM    481  C6   DG B  24      16.832  24.487  26.557  1.00 18.77           C  
ATOM    482  O6   DG B  24      15.806  25.175  26.597  1.00 21.44           O  
ATOM    483  N1   DG B  24      18.022  24.988  26.044  1.00 17.00           N  
ATOM    484  C2   DG B  24      19.203  24.304  25.959  1.00 15.17           C  
ATOM    485  N2   DG B  24      20.247  24.964  25.429  1.00 16.11           N  
ATOM    486  N3   DG B  24      19.351  23.058  26.366  1.00 20.87           N  
ATOM    487  C4   DG B  24      18.199  22.542  26.875  1.00 17.41           C  
TER     488       DG B  24                                                      
HETATM  489  C1  D1B A1013      10.496  24.748   5.157  1.00 31.79           C  
HETATM  490  S2  D1B A1013      10.864  23.585   6.359  1.00 35.65           S  
HETATM  491  C3  D1B A1013       9.389  23.888   7.152  1.00 27.19           C  
HETATM  492  C4  D1B A1013       8.630  24.836   6.525  1.00 30.50           C  
HETATM  493  C5  D1B A1013       9.257  25.331   5.383  1.00 29.60           C  
HETATM  494  C6  D1B A1013       9.085  23.091   8.411  1.00 26.48           C  
HETATM  495  N7  D1B A1013       7.915  23.088   8.950  1.00 25.61           N  
HETATM  496  C8  D1B A1013       8.036  22.254  10.053  1.00 24.26           C  
HETATM  497  C9  D1B A1013       9.336  21.768  10.129  1.00 23.04           C  
HETATM  498  N10 D1B A1013      10.087  22.283   9.062  1.00 25.52           N  
HETATM  499  C11 D1B A1013       7.068  21.894  11.004  1.00 24.40           C  
HETATM  500  C12 D1B A1013       7.446  21.032  12.031  1.00 24.32           C  
HETATM  501  C13 D1B A1013       8.771  20.509  12.143  1.00 22.33           C  
HETATM  502  C14 D1B A1013       9.725  20.895  11.157  1.00 13.88           C  
HETATM  503  C15 D1B A1013      11.385  25.030   4.074  1.00 34.50           C  
HETATM  504  C16 D1B A1013      11.202  26.187   3.292  1.00 34.73           C  
HETATM  505  C17 D1B A1013      12.056  26.461   2.235  1.00 38.52           C  
HETATM  506  C18 D1B A1013      13.127  25.595   1.900  1.00 38.66           C  
HETATM  507  C19 D1B A1013      13.280  24.434   2.689  1.00 36.85           C  
HETATM  508  C20 D1B A1013      12.427  24.157   3.757  1.00 32.96           C  
HETATM  509  C21 D1B A1013       9.137  19.637  13.184  1.00 23.33           C  
HETATM  510  N22 D1B A1013      10.401  19.498  13.600  1.00 23.36           N  
HETATM  511  N23 D1B A1013       8.266  18.856  13.836  1.00 30.96           N  
HETATM  512  C24 D1B A1013      13.975  25.899   0.815  1.00 38.50           C  
HETATM  513  N25 D1B A1013      14.368  24.954  -0.052  1.00 38.92           N  
HETATM  514  N26 D1B A1013      14.418  27.125   0.535  1.00 34.46           N  
HETATM  515 MG    MG A1014      14.744  29.096  19.592  1.00 25.13          MG  
HETATM  516  O   HOH A2001      15.759  30.112  26.992  1.00 21.43           O  
HETATM  517  O   HOH A2002      12.565  28.559  23.473  1.00 26.64           O  
HETATM  518  O   HOH A2003      16.704  30.893  16.619  1.00 24.38           O  
HETATM  519  O   HOH A2004      21.386  28.369  16.427  1.00 35.67           O  
HETATM  520  O   HOH A2005      17.150  28.945  15.040  1.00 28.75           O  
HETATM  521  O   HOH A2006      11.526  11.751   7.365  1.00 31.34           O  
HETATM  522  O   HOH A2007       8.422  13.463   6.186  1.00 25.20           O  
HETATM  523  O   HOH A2008      13.078  31.113  23.035  1.00 31.33           O  
HETATM  524  O   HOH A2009      16.867  28.971  19.569  1.00 23.20           O  
HETATM  525  O   HOH A2010      21.109  30.022  18.724  1.00 36.99           O  
HETATM  526  O   HOH A2011      14.698  27.798  21.264  1.00 19.79           O  
HETATM  527  O   HOH A2012       7.493  16.575   2.509  1.00 34.06           O  
HETATM  528  O   HOH A2013      25.711  29.518  17.947  1.00 33.13           O  
HETATM  529  O   HOH A2014      18.250  27.190  16.066  1.00 35.96           O  
HETATM  530  O   HOH A2015      13.043   9.267  12.979  1.00 22.54           O  
HETATM  531  O   HOH A2016      10.883  10.432  14.684  1.00 22.77           O  
HETATM  532  O   HOH A2017      18.250  16.292  10.115  1.00 35.19           O  
HETATM  533  O   HOH A2018      14.641  12.738  11.360  1.00 31.62           O  
HETATM  534  O   HOH A2019       7.153  10.963  13.835  1.00 27.25           O  
HETATM  535  O   HOH A2020      10.823  10.805  11.693  1.00 17.01           O  
HETATM  536  O   HOH A2021      17.023  15.699   7.144  1.00 40.91           O  
HETATM  537  O   HOH A2022       7.284  14.450  15.415  1.00 37.27           O  
HETATM  538  O   HOH A2023      10.213  13.285   8.552  1.00 17.30           O  
HETATM  539  O   HOH A2024       6.984  15.562   5.107  1.00 34.32           O  
HETATM  540  O   HOH A2025      14.027  14.558   4.403  1.00 24.30           O  
HETATM  541  O   HOH A2026       6.920  18.823   0.742  1.00 33.80           O  
HETATM  542  O   HOH A2027       9.713  15.793   1.343  1.00 17.01           O  
HETATM  543  O   HOH A2028      11.270  24.683  -9.328  1.00 42.67           O  
HETATM  544  O   HOH A2029      12.916  23.597 -10.916  1.00 33.98           O  
HETATM  545  O   HOH A2030      20.586  25.887  -4.224  1.00 34.50           O  
HETATM  546  O   HOH A2031      21.390  23.179 -13.537  1.00 19.77           O  
HETATM  547  O   HOH A2032      23.197  24.082  -9.905  1.00 41.73           O  
HETATM  548  O   HOH A2033      23.037  25.122  -7.015  1.00 39.17           O  
HETATM  549  O   HOH A2034      13.596  29.361   1.359  1.00 32.10           O  
HETATM  550  O   HOH B2001       7.501  14.926  -5.588  1.00 34.52           O  
HETATM  551  O   HOH B2002       7.765  20.074  -7.229  1.00 28.01           O  
HETATM  552  O   HOH B2003      10.552  13.004 -11.798  1.00 44.44           O  
HETATM  553  O   HOH B2004       6.900  11.003  -6.021  1.00 35.11           O  
HETATM  554  O   HOH B2005       9.086  16.898  -5.432  1.00 47.11           O  
HETATM  555  O   HOH B2006       9.913  14.507  -4.034  1.00 36.47           O  
HETATM  556  O   HOH B2007      20.009   8.665  -5.938  1.00 30.31           O  
HETATM  557  O   HOH B2008      16.993  11.815   0.511  1.00 36.94           O  
HETATM  558  O   HOH B2009      12.078  13.338  -0.249  1.00 45.04           O  
HETATM  559  O   HOH B2010      14.972  14.602   1.928  1.00 37.13           O  
HETATM  560  O   HOH B2011      17.061  14.657   2.888  1.00 32.96           O  
HETATM  561  O   HOH B2012      17.559  15.768   4.837  1.00 31.48           O  
HETATM  562  O   HOH B2013      20.039  17.924   4.813  1.00 33.07           O  
HETATM  563  O   HOH B2014      20.615  21.704   6.280  1.00 33.10           O  
HETATM  564  O   HOH B2015      19.799  22.476   9.715  1.00 27.46           O  
HETATM  565  O   HOH B2016      19.014  26.127  12.262  1.00 44.92           O  
HETATM  566  O   HOH B2017      14.752  27.452  15.559  1.00 21.69           O  
HETATM  567  O   HOH B2018       3.944  23.385  17.287  1.00 40.39           O  
HETATM  568  O   HOH B2019      14.618  27.421  18.279  1.00 19.72           O  
HETATM  569  O   HOH B2020      11.432  26.779  19.358  1.00 24.58           O  
HETATM  570  O   HOH B2021      11.088  22.072  27.725  1.00 34.63           O  
HETATM  571  O   HOH B2022      13.847  18.431  21.788  1.00 31.06           O  
HETATM  572  O   HOH B2023      10.696  25.504  23.529  1.00 33.42           O  
HETATM  573  O   HOH B2024      21.093  16.115  30.928  1.00 40.94           O  
HETATM  574  O   HOH B2025      13.770  22.039  28.657  1.00 35.30           O  
HETATM  575  O   HOH B2026      15.326  27.706  28.369  1.00 31.24           O  
CONECT  489  490  493  503                                                      
CONECT  490  489  491                                                           
CONECT  491  490  492  494                                                      
CONECT  492  491  493                                                           
CONECT  493  489  492                                                           
CONECT  494  491  495  498                                                      
CONECT  495  494  496                                                           
CONECT  496  495  497  499                                                      
CONECT  497  496  498  502                                                      
CONECT  498  494  497                                                           
CONECT  499  496  500                                                           
CONECT  500  499  501                                                           
CONECT  501  500  502  509                                                      
CONECT  502  497  501                                                           
CONECT  503  489  504  508                                                      
CONECT  504  503  505                                                           
CONECT  505  504  506                                                           
CONECT  506  505  507  512                                                      
CONECT  507  506  508                                                           
CONECT  508  503  507                                                           
CONECT  509  501  510  511                                                      
CONECT  510  509                                                                
CONECT  511  509                                                                
CONECT  512  506  513  514                                                      
CONECT  513  512                                                                
CONECT  514  512                                                                
CONECT  515  524  526  568                                                      
CONECT  524  515                                                                
CONECT  526  515                                                                
CONECT  568  515                                                                
MASTER      250    0    2    0    0    0    5    6  573    2   30    2          
END                                                                             
`;

export class PDBLoader extends THREE.Loader {

    constructor(manager) {

        super(manager);

    }

    load(onLoad, onProgress, onError) {

        const scope = this;
        const loader = new THREE.FileLoader(scope.manager);
        loader.setPath(scope.path);
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        console.log("hello")
        loader.load("", () => {
            console.log("hehe");
            try {

                onLoad(scope.parse(pdbText));
                console.log(scope.parse(pdbText));
            } catch (e) {
                console.log("fuck");
                if (onError) {

                    onError(e);

                } else {

                    console.error(e);

                }

                scope.manager.itemError(url);

            }

        }, onProgress, onError);

    } // Based on CanvasMol PDB parser


    parse(text) {

        function trim(text) {

            return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

        }

        function capitalize(text) {

            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

        }

        function hash(s, e) {

            return 's' + Math.min(s, e) + 'e' + Math.max(s, e);

        }

        function parseBond(start, length, satom, i) {

            const eatom = parseInt(lines[i].slice(start, start + length));

            if (eatom) {

                const h = hash(satom, eatom);

                if (_bhash[h] === undefined) {

                    _bonds.push([satom - 1, eatom - 1, 1]);

                    _bhash[h] = _bonds.length - 1;

                } else { // doesn't really work as almost all PDBs
                    // have just normal bonds appearing multiple
                    // times instead of being double/triple bonds
                    // bonds[bhash[h]][2] += 1;
                }

            }

        }

        function buildGeometry() {

            const build = {
                geometryAtoms: new THREE.BufferGeometry(),
                geometryBonds: new THREE.BufferGeometry(),
                json: {
                    atoms: atoms
                }
            };
            const geometryAtoms = build.geometryAtoms;
            const geometryBonds = build.geometryBonds;
            const verticesAtoms = [];
            const colorsAtoms = [];
            const verticesBonds = []; // atoms

            for (let i = 0, l = atoms.length; i < l; i++) {

                const atom = atoms[i];
                const x = atom[0];
                const y = atom[1];
                const z = atom[2];
                verticesAtoms.push(x, y, z);
                const r = atom[3][0] / 255;
                const g = atom[3][1] / 255;
                const b = atom[3][2] / 255;
                colorsAtoms.push(r, g, b);

            } // bonds


            for (let i = 0, l = _bonds.length; i < l; i++) {

                const bond = _bonds[i];
                const start = bond[0];
                const end = bond[1];
                const startAtom = _atomMap[start];
                const endAtom = _atomMap[end];
                let x = startAtom[0];
                let y = startAtom[1];
                let z = startAtom[2];
                verticesBonds.push(x, y, z);
                x = endAtom[0];
                y = endAtom[1];
                z = endAtom[2];
                verticesBonds.push(x, y, z);

            } // build geometry


            geometryAtoms.setAttribute('position', new THREE.Float32BufferAttribute(verticesAtoms, 3));
            geometryAtoms.setAttribute('color', new THREE.Float32BufferAttribute(colorsAtoms, 3));
            geometryBonds.setAttribute('position', new THREE.Float32BufferAttribute(verticesBonds, 3));
            return build;

        }

        const CPK = {
            h: [255, 255, 255],
            he: [217, 255, 255],
            li: [204, 128, 255],
            be: [194, 255, 0],
            b: [255, 181, 181],
            c: [144, 144, 144],
            n: [48, 80, 248],
            o: [255, 13, 13],
            f: [144, 224, 80],
            ne: [179, 227, 245],
            na: [171, 92, 242],
            mg: [138, 255, 0],
            al: [191, 166, 166],
            si: [240, 200, 160],
            p: [255, 128, 0],
            s: [255, 255, 48],
            cl: [31, 240, 31],
            ar: [128, 209, 227],
            k: [143, 64, 212],
            ca: [61, 255, 0],
            sc: [230, 230, 230],
            ti: [191, 194, 199],
            v: [166, 166, 171],
            cr: [138, 153, 199],
            mn: [156, 122, 199],
            fe: [224, 102, 51],
            co: [240, 144, 160],
            ni: [80, 208, 80],
            cu: [200, 128, 51],
            zn: [125, 128, 176],
            ga: [194, 143, 143],
            ge: [102, 143, 143],
            as: [189, 128, 227],
            se: [255, 161, 0],
            br: [166, 41, 41],
            kr: [92, 184, 209],
            rb: [112, 46, 176],
            sr: [0, 255, 0],
            y: [148, 255, 255],
            zr: [148, 224, 224],
            nb: [115, 194, 201],
            mo: [84, 181, 181],
            tc: [59, 158, 158],
            ru: [36, 143, 143],
            rh: [10, 125, 140],
            pd: [0, 105, 133],
            ag: [192, 192, 192],
            cd: [255, 217, 143],
            in: [166, 117, 115],
            sn: [102, 128, 128],
            sb: [158, 99, 181],
            te: [212, 122, 0],
            i: [148, 0, 148],
            xe: [66, 158, 176],
            cs: [87, 23, 143],
            ba: [0, 201, 0],
            la: [112, 212, 255],
            ce: [255, 255, 199],
            pr: [217, 255, 199],
            nd: [199, 255, 199],
            pm: [163, 255, 199],
            sm: [143, 255, 199],
            eu: [97, 255, 199],
            gd: [69, 255, 199],
            tb: [48, 255, 199],
            dy: [31, 255, 199],
            ho: [0, 255, 156],
            er: [0, 230, 117],
            tm: [0, 212, 82],
            yb: [0, 191, 56],
            lu: [0, 171, 36],
            hf: [77, 194, 255],
            ta: [77, 166, 255],
            w: [33, 148, 214],
            re: [38, 125, 171],
            os: [38, 102, 150],
            ir: [23, 84, 135],
            pt: [208, 208, 224],
            au: [255, 209, 35],
            hg: [184, 184, 208],
            tl: [166, 84, 77],
            pb: [87, 89, 97],
            bi: [158, 79, 181],
            po: [171, 92, 0],
            at: [117, 79, 69],
            rn: [66, 130, 150],
            fr: [66, 0, 102],
            ra: [0, 125, 0],
            ac: [112, 171, 250],
            th: [0, 186, 255],
            pa: [0, 161, 255],
            u: [0, 143, 255],
            np: [0, 128, 255],
            pu: [0, 107, 255],
            am: [84, 92, 242],
            cm: [120, 92, 227],
            bk: [138, 79, 227],
            cf: [161, 54, 212],
            es: [179, 31, 212],
            fm: [179, 31, 186],
            md: [179, 13, 166],
            no: [189, 13, 135],
            lr: [199, 0, 102],
            rf: [204, 0, 89],
            db: [209, 0, 79],
            sg: [217, 0, 69],
            bh: [224, 0, 56],
            hs: [230, 0, 46],
            mt: [235, 0, 38],
            ds: [235, 0, 38],
            rg: [235, 0, 38],
            cn: [235, 0, 38],
            uut: [235, 0, 38],
            uuq: [235, 0, 38],
            uup: [235, 0, 38],
            uuh: [235, 0, 38],
            uus: [235, 0, 38],
            uuo: [235, 0, 38]
        };
        const atoms = [];
        const _bonds = [];
        const _bhash = {};
        const _atomMap = {}; // parse

        const lines = text.split('\n');

        for (let i = 0, l = lines.length; i < l; i++) {

            if (lines[i].slice(0, 4) === 'ATOM' || lines[i].slice(0, 6) === 'HETATM') {

                const x = parseFloat(lines[i].slice(30, 37));
                const y = parseFloat(lines[i].slice(38, 45));
                const z = parseFloat(lines[i].slice(46, 53));
                const index = parseInt(lines[i].slice(6, 11)) - 1;
                let e = trim(lines[i].slice(76, 78)).toLowerCase();

                if (e === '') {

                    e = trim(lines[i].slice(12, 14)).toLowerCase();

                }

                const atomData = [x, y, z, CPK[e], capitalize(e)];
                atoms.push(atomData);
                _atomMap[index] = atomData;

            } else if (lines[i].slice(0, 6) === 'CONECT') {

                const satom = parseInt(lines[i].slice(6, 11));
                parseBond(11, 5, satom, i);
                parseBond(16, 5, satom, i);
                parseBond(21, 5, satom, i);
                parseBond(26, 5, satom, i);

            }

        } // build and return geometry


        return buildGeometry();

    }

}

// THREE.PDBLoader = PDBLoader;