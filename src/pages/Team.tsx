import React from 'react';
import SiteHeader from '../components/landing/SiteHeader';
import SiteFooter from '../components/landing/SiteFooter';
import { Card, CardContent } from '../components/landing/Card';
// import Badge from '../components/landing/Badge';

// Import all WhatsApp images
import img1 from '../assets/WhatsApp Image 2025-11-16 at 17.28.31_1203b85a.jpg';
import img2 from '../assets/WhatsApp Image 2025-11-16 at 17.29.10_5ed7aced.jpg';
import img3 from '../assets/WhatsApp Image 2025-11-16 at 17.33.36_7ac96a2f.jpg';
import img4 from '../assets/WhatsApp Image 2025-11-16 at 17.36.16_53022e51.jpg';
import img6 from '../assets/WhatsApp Image 2025-11-16 at 18.34.27_c67dd515.jpg';
import img7 from '../assets/WhatsApp Image 2025-11-16 at 18.41.40_4534cac9.jpg';
import img8 from '../assets/WhatsApp Image 2025-11-16 at 18.58.00_e99cf6ca.jpg';
import img9 from '../assets/WhatsApp Image 2025-11-16 at 19.02.50_90ab6e6d.jpg';
import img10 from '../assets/WhatsApp Image 2025-11-16 at 19.11.39_1cadef38.jpg';
import img11 from '../assets/WhatsApp Image 2025-11-16 at 19.27.11_ea6d61ba.jpg';
import img12 from '../assets/WhatsApp Image 2025-11-16 at 19.30.51_e27ddf2e.jpg';
import img13 from '../assets/WhatsApp Image 2025-11-16 at 19.38.34_343b3f35.jpg';
import img14 from '../assets/WhatsApp Image 2025-11-16 at 23.06.03_6996aa42.jpg';
import img15 from '../assets/bobo final.png';
import img16 from '../assets/chime final.png';
import img17 from '../assets/lela final.png';
import img18 from '../assets/tandin final.png';
import img19 from '../assets/Picturetokenization.jpeg';
// import { TextAlignEndIcon } from 'lucide-react';

const teamMembers = [
  {
    name: 'Tandin Wangmo',
    role: 'Team Lead',
    image: img18,
    bio: 'I currently serve as a Regional Head at the Urban Land Division, NLCS. I am a certified property valuer from University Technology Malaysia and have been part of the PAVA Taskforce since 2019 and the Property Tax Taskforce since 2022.',
    department: 'BA in Psychology, Economics, and Marketing',
  },
  {
    name: 'Tshewang Wangchuk',
    role: 'HR Team',
    image: img11,
    bio: 'I am a HR professional with a proven track record at Royal Insurance Corporation of Bhutan Limited, where I excelled in policy development, employee relations, and strategic HR initiatives. My key achievements in policy development include spearheading the creation of the company\'s Service Rules, Employee Compensation and Benefits Manual, Performance Management System Manual, Board Remuneration Policy, and Management Manual.',
    department: 'BA. (Hons) Psychology and HRM',
  },
  {
    name: 'Sonam Choki',
    role: 'HR Team',
    image: img7,
    bio: 'An English Honors graduate with strong communication, public speaking, and social media skills, combined with proficiency in MS Office. Adaptive and quick to learn, I bring creativity, integrity, and the ability to thrive as both a leader and a team player, with a commitment to continuous growth and contribution in a dynamic work environment.',
    department: 'BA Liberal Arts(English Honors)',
  },
  {
    name: 'Chimi Lham',
    role: 'Tech Lead',
    image: img16,
    bio: 'I am Chimi Lham, serving as a Survey Engineer under the Cadastral Information Division of the National Land Commission. I graduated from JNEC with a degree in Surveying and Geoinformatics, and my work focuses on cadastral mapping, land data management, geospatial analysis, and ensuring the accuracy and integrity of national land records.',
    department: 'BE Surveying and Geoinformatics',
  },
  {
    name: 'Pema Seldon',
    role: 'Tech Team',
    image: img2,
    bio: 'I am Pema Seldon, a GIS Officer with the Urban Planning Division, Samdrup Jongkhar Thromde. I graduated from Amity University, India, pursuing a degree in B.Sc. Geoinformatics. I work with maps, data, and technology to turn complex information into insights that help communities grow smarter and stronger.',
    department: 'B.Sc Geoinformatics',
  },
  {
    name: 'Kinley Wangyel',
    role: 'Tech Team',
    image: img10,
    bio: 'Hi! I\'m a full-stack developer who basically lives on coffee, commits, and the thrill of finally fixing that one bug at 3 AM. I build from sleek frontends to stubborn backends, and I love turning chaotic ideas into apps that actually work. If it involves code, creativity, and a little bit of chaos- I\'m in.',
    department: 'B.Sc Computer Science',
  },
  {
    name: 'Tandin Dorji',
    role: 'Tech Team',
    image: img13,
    bio: 'My core responsibilities on the team involve Blockchain implementation, smart contract drafting (ensuring they are secure and efficient), and Decentralized Application (DApp) development. Crucially, I\'m also an expert in full-stack development, meaning I will help handle both the backend logic and the frontend interface.',
    department: 'B.Sc Computer Science',
  },
  {
    name: 'Namgyel Wangdi',
    role: 'Tech Team',
    image: img1,
    bio: 'I\'m Namgyel Wangdi, a survey engineer with the National Land Commission, currently serving under the Governor\'s Office for the Gelephu Mindfulness City (GMC) initiative. My work is rooted in geospatial precision and national service, and I\'m proud to be contributing to one of Bhutan\'s most ambitious and transformative projects.',
    department: 'BE Surveying and Geoinformatics',
  },
  {
    name: 'Tandin Tshewang',
    role: 'Tech Team',
    image: img15,
    bio: 'I am Tandin Tshewang, with a background in Surveying and Geoinformatics Engineering and practical experience in mining operations. I bring strong analytical skills, field experience, and additional abilities in graphic design and videography, helping me deliver both technical accuracy and creative value.',
    department: 'BE Surveying and Geoinformatics',
  },
  {
    name: 'Thinley Om',
    role: 'ROD Lead',
    image: img4,
    bio: 'Hello Everyone, I am Thinley Om, an Attorney at the Office of the Attorney General, Bhutan. I joined this team to contribute my legal expertise to the GMC Land Tokenization project under the Innovate for GMC program. With my background, I contribute to policy drafting, legal feasibility assessments, and ensuring that the token economy aligns with Bhutanese laws and values, especially protecting landowners\' rights and promoting transparency.',
    department: 'BE Surveying and Geoinformatics',
  },
  {
    name: 'Dechen Pelden',
    role: 'ROD Team',
    image: img9,
    bio: 'I am Pelsup Dechen Pelden. I currently work as a Financial Analyst at the Royal Securities Exchange of Bhutan, where I analyse financial data, prepare reports, and support regulatory and policy-related work. I hold a Bachelor of Commerce in Finance.',
    department: 'B.Com Finance',
  },
  {
    name: 'Tshering Pelden',
    role: 'ROD Team',
    image: img8,
    bio: 'I describe myself as a hardworking person who values teamwork, enjoys creating a positive work environment, and is always eager to learn new skills. In this role, I will be working as a data analyst, using Excel to create pie charts, bar graphs, and line graphs to present data clearly and meaningfully.',
    department: 'Bcom Finance',
  },
  {
    name: 'Dechen Choden',
    role: 'ROD Team',
    image: img6,
    bio: 'I am Pelsup Dechen Choden. I hold a Bachelor\'s in Commerce (Honours) from Chandigarh University and have worked with organizations such as BBS, Bhutan Data Science, and Zhenphen Solar, where I strengthened my skills in communication, research, financial management, and digital tools.',
    department: 'Bachelor of commerce (honours)',
  },
  {
    name: 'Srijana Gurung',
    role: 'ROD Team',
    image: img14,
    bio: 'I graduated from Norbuling Rigter College, Paro, with a Bachelor of Arts in Development Studies. As part of my academic training, I completed an internship with the Planning Division at Haa Dzongkhag and participated in a workshop on qualitative research methods.',
    department: 'BA Development Studies',
  },
  {
    name: 'Sonam Zangmo',
    role: 'ROD Team',
    image: img12,
    bio: 'I am Pelsup Sonam Zangmo, a recent graduate from Norbuling Rigter College with a Bachelor\'s degree in Commerce, specializing in Finance. Currently, I serve as a member of the GMC Land Tokenization team in the role of Data Analyst. I have also participated in entrepreneurship training and completed the IC3 Digital Literacy certification.',
    department: 'B.Com Finance',
  },
  {
    name: 'Dechen Wangmo',
    role: 'COM Team',
    image: img19,
    bio: 'I am Pelsup Dechen Wangmo, a recent BBA Marketing graduate from Gedu College of Business Studies with additional training in digital skills and marketing. I would describe myself as dedicated, adaptable, and eager to learn, especially when working on new and innovative ideas.',
    department: 'BBA, Marketing',
  },
  {
    name: 'Leela Bdr Bhattarai',
    role: 'COM Team',
    image: img17,
    bio: 'I am passionate about data science and artificial intelligence, with a strong interest in turning raw data into meaningful insights. I enjoy working with data to uncover patterns, support decision making, and solve real-world problems. As a dedicated learner in this field, I bring analytical thinking, curiosity, and a commitment to accuracy.',
    department: 'BSC. data science',
  },
  {
    name: 'Thukten Dema',
    role: 'COM Team',
    image: img3,
    bio: 'I have graduated from Royal Thimphu College with a degree in Bachelor of Arts in Anthropology. I possess research skills in conducting a thorough literature review, designing projects, and analyzing data. I am resilient and adaptable to cross-functional teams, and can present clear, concise reports. Strong organizational skills and a keen eye for detail, ensuring high-quality data in all research activities.',
    department: 'B.A Anthropology',
  },
];

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="py-16 md:py-24 border-b border-border/40">
          <div className="container mx-auto px-4 md:px-2">
            <div className="text-center mb-16 space-y-4">
              {/* <Badge variant="secondary" className="px-4 py-1">
                Our People
              </Badge> */}
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Meet the Team
              </h1>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="py-8 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="w-full aspect-square overflow-hidden bg-muted">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                        <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TeamPage;
