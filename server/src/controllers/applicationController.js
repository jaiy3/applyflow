import prisma from "../utils/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

const allowedSortFields = [
  "createdAt",
  "updatedAt",
  "company",
  "jobTitle",
  "dateApplied",
  "deadline",
  "status",
];

const applicationSelect = {
  id: true,
  company: true,
  jobTitle: true,
  location: true,
  jobUrl: true,
  salaryMin: true,
  salaryMax: true,
  salaryCurrency: true,
  status: true,
  workType: true,
  employmentType: true,
  dateApplied: true,
  deadline: true,
  notes: true,
  contactName: true,
  contactEmail: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

const parseOptionalDate = (value) => {
  if (!value) {
    return null;
  }

  return new Date(value);
};

const normalizeOptionalString = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

const buildApplicationData = (body) => {
  const data = {};

  if (body.company !== undefined) {
    data.company = body.company.trim();
  }

  if (body.jobTitle !== undefined) {
    data.jobTitle = body.jobTitle.trim();
  }

  if (body.location !== undefined) {
    data.location = normalizeOptionalString(body.location);
  }

  if (body.jobUrl !== undefined) {
    data.jobUrl = normalizeOptionalString(body.jobUrl);
  }

  if (body.salaryMin !== undefined) {
    data.salaryMin = body.salaryMin;
  }

  if (body.salaryMax !== undefined) {
    data.salaryMax = body.salaryMax;
  }

  if (body.salaryCurrency !== undefined) {
    data.salaryCurrency = body.salaryCurrency.trim().toUpperCase();
  }

  if (body.status !== undefined) {
    data.status = body.status;
  }

  if (body.workType !== undefined) {
    data.workType = body.workType;
  }

  if (body.employmentType !== undefined) {
    data.employmentType = body.employmentType;
  }

  if (body.dateApplied !== undefined) {
    data.dateApplied = parseOptionalDate(body.dateApplied);
  }

  if (body.deadline !== undefined) {
    data.deadline = parseOptionalDate(body.deadline);
  }

  if (body.notes !== undefined) {
    data.notes = normalizeOptionalString(body.notes);
  }

  if (body.contactName !== undefined) {
    data.contactName = normalizeOptionalString(body.contactName);
  }

  if (body.contactEmail !== undefined) {
    const normalizedContactEmail = normalizeOptionalString(body.contactEmail);

    data.contactEmail = normalizedContactEmail
      ? normalizedContactEmail.toLowerCase()
      : null;
  }

  return data;
};

export const createApplication = asyncHandler(async (req, res) => {
  const applicationData = buildApplicationData(req.validated.body);

  const application = await prisma.jobApplication.create({
    data: {
      ...applicationData,
      userId: req.user.id,
    },
    select: applicationSelect,
  });

  res.status(201).json({
    success: true,
    message: "Job application created successfully.",
    application,
  });
});

export const getApplications = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    workType,
    employmentType,
    sortBy,
    sortOrder,
    page,
    limit,
  } = req.validated.query;

  const where = {
    userId: req.user.id,
  };

  if (status) {
    where.status = status;
  }

  if (workType) {
    where.workType = workType;
  }

  if (employmentType) {
    where.employmentType = employmentType;
  }

  if (search) {
    where.OR = [
      {
        company: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        jobTitle: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        location: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        notes: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const safeSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      select: applicationSelect,
      orderBy: {
        [safeSortField]: safeSortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.jobApplication.count({
      where,
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalApplications / limit)
  );

  res.status(200).json({
    success: true,
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      pageSize: limit,
      totalApplications,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.validated.params;

  const application = await prisma.jobApplication.findFirst({
    where: {
      id: applicationId,
      userId: req.user.id,
    },
    select: applicationSelect,
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Job application not found.",
    });
  }

  res.status(200).json({
    success: true,
    application,
  });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.validated.params;

  const existingApplication =
    await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
      select: {
        id: true,
      },
    });

  if (!existingApplication) {
    return res.status(404).json({
      success: false,
      message: "Job application not found.",
    });
  }

  const applicationData = buildApplicationData(
    req.validated.body
  );

  const application = await prisma.jobApplication.update({
    where: {
      id: applicationId,
    },
    data: applicationData,
    select: applicationSelect,
  });

  res.status(200).json({
    success: true,
    message: "Job application updated successfully.",
    application,
  });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.validated.params;

  const existingApplication =
    await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
      select: {
        id: true,
      },
    });

  if (!existingApplication) {
    return res.status(404).json({
      success: false,
      message: "Job application not found.",
    });
  }

  await prisma.jobApplication.delete({
    where: {
      id: applicationId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Job application deleted successfully.",
  });
});

export const getApplicationStatistics = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const [
      totalApplications,
      statusGroups,
      recentApplications,
      upcomingDeadlines,
    ] = await Promise.all([
      prisma.jobApplication.count({
        where: {
          userId,
        },
      }),

      prisma.jobApplication.groupBy({
        by: ["status"],
        where: {
          userId,
        },
        _count: {
          _all: true,
        },
      }),

      prisma.jobApplication.findMany({
        where: {
          userId,
        },
        select: applicationSelect,
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      prisma.jobApplication.findMany({
        where: {
          userId,
          deadline: {
            gte: new Date(),
          },
          status: {
            notIn: ["REJECTED", "WITHDRAWN"],
          },
        },
        select: applicationSelect,
        orderBy: {
          deadline: "asc",
        },
        take: 5,
      }),
    ]);

    const byStatus = {
      SAVED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    for (const group of statusGroups) {
      byStatus[group.status] = group._count._all;
    }

    const activeApplications =
      byStatus.SAVED +
      byStatus.APPLIED +
      byStatus.INTERVIEW;

    const responseRate =
      totalApplications === 0
        ? 0
        : Number(
            (
              ((byStatus.INTERVIEW +
                byStatus.OFFER +
                byStatus.REJECTED) /
                totalApplications) *
              100
            ).toFixed(1)
          );

    const offerRate =
      totalApplications === 0
        ? 0
        : Number(
            (
              (byStatus.OFFER / totalApplications) *
              100
            ).toFixed(1)
          );

    res.status(200).json({
      success: true,
      statistics: {
        totalApplications,
        activeApplications,
        responseRate,
        offerRate,
        byStatus,
      },
      recentApplications,
      upcomingDeadlines,
    });
  }
);