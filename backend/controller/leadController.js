const Lead = require("../Model/Lead");

exports.addLead = async (req, res) => {
  const { name, email, phone, service, price, status, source, assignedTo,createdBy,followup} = req.body;
 
  if(!name||!email||!phone||!service){
    res.status(500).json("Required field are missing");
  }
  try {
    const newLead = new Lead({ name, email, phone, service, price, status, source, createdBy, assignedTo,followup });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  const { leadId } = req.params; // Get leadId from route parameters
  const { name, email, phone, service, price, status, assignedTo,followup } = req.body;
  const { role } = req.user; 

  try {
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (role === 'user') {
      // User can only update lead status
      lead.status = status;
      lead.name = name;
      lead.email = email;
      lead.phone = phone;
      lead.service = service;
      lead.price = price;
      lead.followup = followup;
    } else if (role === 'admin' || role === 'manager') {
      // Admin or manager can update all lead fields
      lead.name = name;
      lead.email = email;
      lead.phone = phone;
      lead.service = service;
      lead.price = price;
      lead.status = status;
      lead.followup = followup;
      lead.assignedTo = assignedTo;
    }

    await lead.save();
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addLeadsBulk = async (req, res) => {
  const { leads, createdBy } = req.body;
  if (!leads || !createdBy) {
    return res.status(400).json({ message: "Required fields are missing" });
  }
  try {
    const newLeads = leads.map(lead => ({
      ...lead,
      createdBy,
      followup: lead.followup || "N/A",
      assignedTo: lead.assignedTo || null,
    }));
    await Lead.insertMany(newLeads);
    res.status(201).json({ message: "Leads created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.findwonleadofuser=async(req,res)=>{
  const userId = req.user._id;
  try {
    const wonLeads = await Lead.find({ assignedTo: userId, status: 'won' });
    res.status(200).json(wonLeads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.deleteLead = async (req, res) => {
  const { leadId } = req.params;
  try {
    const lead = await Lead.findByIdAndDelete(leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};